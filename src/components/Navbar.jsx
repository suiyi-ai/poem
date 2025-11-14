import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📜</span>
          <span className="brand-text">诗词赏析</span>
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              首页
            </Link>
          </li>
          <li>
            <Link 
              to="/collection" 
              className={location.pathname === '/collection' ? 'active' : ''}
            >
              我的收藏
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

