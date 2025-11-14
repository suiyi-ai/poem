import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PoemDetail from './pages/PoemDetail'
import AuthorDetail from './pages/AuthorDetail'
import Collection from './pages/Collection'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poem/:id" element={<PoemDetail />} />
            <Route path="/author/:id" element={<AuthorDetail />} />
            <Route path="/collection" element={<Collection />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

