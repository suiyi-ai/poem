import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Home.css'

function Home() {
  const [poems, setPoems] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // 加载热门诗词
      const { data: poemsData, error: poemsError } = await supabase
        .from('poems')
        .select(`
          *,
          authors (
            id,
            name,
            dynasty
          )
        `)
        .order('views', { ascending: false })
        .limit(12)

      if (poemsError) throw poemsError

      // 加载作者列表
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select('*')
        .order('name')
        .limit(10)

      if (authorsError) throw authorsError

      setPoems(poemsData || [])
      setAuthors(authorsData || [])
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      loadData()
      return
    }

    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          authors (
            id,
            name,
            dynasty
          )
        `)
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .limit(20)

      if (error) throw error
      setPoems(data || [])
    } catch (error) {
      console.error('搜索失败:', error)
    }
  }

  const handleCollect = async (poemId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest-' + Date.now()
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId)
      }

      const { error } = await supabase
        .from('collections')
        .insert({
          user_id: userId,
          poem_id: poemId,
          created_at: new Date().toISOString()
        })

      if (error && error.code !== '23505') {
        throw error
      }
      
      // 使用更友好的提示方式
      if (error?.code === '23505') {
        // 已在收藏中，不显示提示
        return
      }
      // 可以添加 toast 提示，暂时使用简单提示
      const btn = document.querySelector(`[data-poem-id="${poemId}"]`)
      if (btn) {
        btn.textContent = '⭐ 已收藏'
        btn.style.opacity = '0.7'
      }
    } catch (error) {
      console.error('收藏失败:', error)
      alert('收藏失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">加载中...</p>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">品味古典诗词之美</h1>
          <p className="hero-subtitle">探索千年文化，感受诗词魅力</p>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="搜索诗词标题、内容或作者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button">
              <span>搜索</span>
            </button>
          </form>
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('')
                loadData()
              }}
              className="clear-search-btn"
            >
              清除搜索
            </button>
          )}
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🔥</span>
            热门诗词
          </h2>
          <span className="section-count">{poems.length} 首</span>
        </div>
        {poems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>暂无诗词</h3>
            <p>搜索其他关键词试试吧</p>
          </div>
        ) : (
          <div className="poems-grid">
            {poems.map((poem) => (
            <div key={poem.id} className="poem-card">
              <div className="poem-header">
                <Link to={`/poem/${poem.id}`} className="poem-title">
                  {poem.title}
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleCollect(poem.id)
                  }}
                  className="collect-btn"
                  title="收藏"
                  data-poem-id={poem.id}
                >
                  ⭐
                </button>
              </div>
              <Link 
                to={`/author/${poem.authors?.id}`} 
                className="poem-author"
              >
                {poem.authors?.name} · {poem.authors?.dynasty}
              </Link>
              <p className="poem-content-preview">
                {poem.content?.split('\n').slice(0, 2).join('\n')}...
              </p>
              <div className="poem-footer">
                <span className="poem-stats">👁 {poem.views || 0}</span>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">👤</span>
            著名诗人
          </h2>
          <span className="section-count">{authors.length} 位</span>
        </div>
        {authors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>暂无诗人信息</h3>
          </div>
        ) : (
          <div className="authors-grid">
          {authors.map((author) => (
            <Link 
              key={author.id} 
              to={`/author/${author.id}`}
              className="author-card"
            >
              <div className="author-avatar">{author.name?.charAt(0)}</div>
              <div className="author-info">
                <h3>{author.name}</h3>
                <p>{author.dynasty}</p>
              </div>
            </Link>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

