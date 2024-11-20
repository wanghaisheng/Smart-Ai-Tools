import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Categories from './pages/Categories'
import About from './pages/About'
import ToolDetail from './pages/ToolDetail'
import SubmitTool from './pages/SubmitTool'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <Router>
      <div className="page-container">
        <Navbar />
        <main className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/:id" element={<ToolDetail />} />
              <Route path="/submit-tool" element={<SubmitTool />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
