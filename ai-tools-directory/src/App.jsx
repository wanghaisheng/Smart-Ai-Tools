import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import { ToolsProvider } from './contexts/ToolsContext'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Tools = lazy(() => import('./pages/Tools'))
const Categories = lazy(() => import('./pages/Categories'))
const About = lazy(() => import('./pages/About'))
const ToolDetail = lazy(() => import('./pages/ToolDetail'))
const SubmitTool = lazy(() => import('./pages/SubmitTool'))

function App() {
  return (
    <Router>
      <ToolsProvider>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={
                <div className="min-h-[400px] flex items-center justify-center">
                  <LoadingSpinner size="large" />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/tools/:id" element={<ToolDetail />} />
                  <Route path="/submit-tool" element={<SubmitTool />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </ToolsProvider>
    </Router>
  )
}

export default App
