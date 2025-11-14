import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AuthorDetail.css'

function AuthorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [author, setAuthor] = useState(null)
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAuthor()
    loadPoems()
  }, [id])

  const loadAuthor = async () => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setAuthor(data)
    } catch (error) {
      console.error('加载作者失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPoems = async () => {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .eq('author_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPoems(data || [])
    } catch (error) {
      console.error('加载诗词列表失败:', error)
    }
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (!author) {
    return <div className="error">作者未找到</div>
  }

  return (
    <div className="author-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← 返回
      </button>

      <div className="author-header">
        <div className="author-avatar-large">
          {author.name?.charAt(0)}
        </div>
        <div className="author-info-detail">
          <h1 className="author-name-large">{author.name}</h1>
          <p className="author-dynasty-large">{author.dynasty}</p>
          {author.birth_year && author.death_year && (
            <p className="author-lifespan">
              {author.birth_year} - {author.death_year}
            </p>
          )}
        </div>
      </div>

      {author.biography && (
        <div className="author-biography">
          <h2>📚 人物简介</h2>
          <p>{author.biography}</p>
        </div>
      )}

      <div className="author-poems">
        <h2>📜 代表作品 ({poems.length})</h2>
        {poems.length === 0 ? (
          <p className="no-poems">暂无作品</p>
        ) : (
          <div className="poems-list">
            {poems.map((poem) => (
              <Link 
                key={poem.id} 
                to={`/poem/${poem.id}`}
                className="poem-item-link"
              >
                <div className="poem-item">
                  <h3 className="poem-item-title">{poem.title}</h3>
                  <p className="poem-item-preview">
                    {poem.content?.split('\n').slice(0, 2).join(' ')}...
                  </p>
                  <div className="poem-item-footer">
                    <span className="poem-item-views">👁 {poem.views || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthorDetail

