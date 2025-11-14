import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './PoemDetail.css'

function PoemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [poem, setPoem] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isCollected, setIsCollected] = useState(false)

  useEffect(() => {
    loadPoem()
    loadComments()
    checkCollection()
  }, [id])

  const loadPoem = async () => {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          authors (
            id,
            name,
            dynasty,
            biography
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setPoem(data)

      // 增加浏览量
      await supabase
        .from('poems')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
    } catch (error) {
      console.error('加载诗词失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('poem_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('加载评论失败:', error)
    }
  }

  const checkCollection = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      const { data, error } = await supabase
        .from('collections')
        .select('id')
        .eq('poem_id', id)
        .eq('user_id', userId)
        .single()

      setIsCollected(!!data && !error)
    } catch (error) {
      setIsCollected(false)
    }
  }

  const handleCollect = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest-' + Date.now()
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId)
      }

      if (isCollected) {
        const { error } = await supabase
          .from('collections')
          .delete()
          .eq('poem_id', id)
          .eq('user_id', userId)

        if (error) throw error
        setIsCollected(false)
        alert('已取消收藏')
      } else {
        const { error } = await supabase
          .from('collections')
          .insert({
            user_id: userId,
            poem_id: id,
            created_at: new Date().toISOString()
          })

        if (error) throw error
        setIsCollected(true)
        alert('收藏成功！')
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
      alert('操作失败，请重试')
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const userId = localStorage.getItem('userId') || 'guest-' + Date.now()
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId)
      }

      const { error } = await supabase
        .from('comments')
        .insert({
          poem_id: id,
          user_id: userId,
          content: newComment,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      setNewComment('')
      loadComments()
      alert('评论发布成功！')
    } catch (error) {
      console.error('发布评论失败:', error)
      alert('发布评论失败，请重试')
    }
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (!poem) {
    return <div className="error">诗词未找到</div>
  }

  return (
    <div className="poem-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← 返回
      </button>

      <div className="poem-main">
        <div className="poem-header-detail">
          <h1 className="poem-title-detail">{poem.title}</h1>
          <Link 
            to={`/author/${poem.authors?.id}`} 
            className="author-link-detail"
          >
            <span className="author-name">{poem.authors?.name}</span>
            <span className="author-dynasty">{poem.authors?.dynasty}</span>
          </Link>
        </div>

        <div className="poem-content-detail">
          <pre className="poem-text">{poem.content}</pre>
        </div>

        {poem.appreciation && (
          <div className="poem-appreciation">
            <h3>📖 赏析</h3>
            <p>{poem.appreciation}</p>
          </div>
        )}

        {poem.translation && (
          <div className="poem-translation">
            <h3>🌐 译文</h3>
            <p>{poem.translation}</p>
          </div>
        )}

        <div className="poem-actions">
          <button 
            onClick={handleCollect}
            className={`collect-btn-detail ${isCollected ? 'collected' : ''}`}
          >
            {isCollected ? '⭐ 已收藏' : '⭐ 收藏'}
          </button>
          <span className="poem-views">👁 {poem.views || 0} 次浏览</span>
        </div>
      </div>

      <div className="comments-section">
        <h2>💬 评论 ({comments.length})</h2>
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的感受..."
            className="comment-input"
            rows="4"
          />
          <button type="submit" className="comment-submit">发布评论</button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">暂无评论，快来发表第一条吧~</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-user">
                    {comment.user_id?.substring(0, 8)}...
                  </span>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleString('zh-CN')}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default PoemDetail

