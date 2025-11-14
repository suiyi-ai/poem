import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Collection.css'

function Collection() {
  const navigate = useNavigate()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          poems (
            id,
            title,
            content,
            views,
            authors (
              id,
              name,
              dynasty
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCollections(data || [])
    } catch (error) {
      console.error('加载收藏失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (collectionId) => {
    if (!confirm('确定要取消收藏吗？')) return

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId)

      if (error) throw error
      loadCollections()
      alert('已取消收藏')
    } catch (error) {
      console.error('取消收藏失败:', error)
      alert('操作失败，请重试')
    }
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  const userId = localStorage.getItem('userId')
  if (!userId) {
    return (
      <div className="collection-empty">
        <p>请先浏览一些诗词，系统会自动为您创建账号</p>
        <button onClick={() => navigate('/')} className="go-home-btn">
          去首页看看
        </button>
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <div className="collection-empty">
        <div className="empty-icon">📚</div>
        <h2>还没有收藏</h2>
        <p>去发现一些喜欢的诗词吧~</p>
        <button onClick={() => navigate('/')} className="go-home-btn">
          去首页看看
        </button>
      </div>
    )
  }

  return (
    <div className="collection">
      <h1 className="collection-title">我的收藏 ({collections.length})</h1>
      <div className="collections-grid">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-card">
            <div className="collection-header">
              <Link 
                to={`/poem/${collection.poems?.id}`} 
                className="collection-poem-title"
              >
                {collection.poems?.title}
              </Link>
              <button
                onClick={() => handleRemove(collection.id)}
                className="remove-btn"
                title="取消收藏"
              >
                ✕
              </button>
            </div>
            <Link 
              to={`/author/${collection.poems?.authors?.id}`}
              className="collection-poem-author"
            >
              {collection.poems?.authors?.name} · {collection.poems?.authors?.dynasty}
            </Link>
            <p className="collection-poem-preview">
              {collection.poems?.content?.split('\n').slice(0, 2).join('\n')}...
            </p>
            <div className="collection-footer">
              <span className="collection-date">
                {new Date(collection.created_at).toLocaleDateString('zh-CN')}
              </span>
              <span className="collection-views">
                👁 {collection.poems?.views || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Collection

