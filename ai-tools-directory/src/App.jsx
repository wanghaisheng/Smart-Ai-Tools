import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import { ToolsProvider } from './contexts/ToolsContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AIProvider } from './contexts/AIContext'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import UserProfile from './components/profile/UserProfile'
import PrivateRoute from './components/auth/PrivateRoute'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Tools = lazy(() => import('./pages/Tools'))
const Categories = lazy(() => import('./pages/Categories'))
const About = lazy(() => import('./pages/About'))
const ToolDetails = lazy(() => import('./pages/ToolDetails'))
const SubmitTool = lazy(() => import('./pages/SubmitTool'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DashboardOverview = lazy(() => import('./pages/Dashboard/DashboardOverview'))
const FavoriteTools = lazy(() => import('./pages/Dashboard/FavoriteTools'))
const SubmittedTools = lazy(() => import('./pages/Dashboard/SubmittedTools'))
const Reviews = lazy(() => import('./pages/Dashboard/Reviews'))
const Collections = lazy(() => import('./pages/Dashboard/Collections'))
const CollectionView = lazy(() => import('./pages/Dashboard/CollectionView'))
const Notifications = lazy(() => import('./pages/Dashboard/Notifications'))
const ApiKeys = lazy(() => import('./pages/Dashboard/ApiKeys'))
const ProfileSettings = lazy(() => import('./pages/Dashboard/ProfileSettings'))
const SmartPromptsPage = lazy(() => import('./smartPrompts/pages/SmartPromptsPage'))

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AIProvider>
          <Router>
            <ToolsProvider>
              <ErrorBoundary>
                <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                  <Navbar />
                  <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                    <Suspense 
                      fallback={
                        <div className="min-h-[60vh] flex items-center justify-center">
                          <div className="text-center">
                            <LoadingSpinner size="large" />
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading content...</p>
                          </div>
                        </div>
                      }
                    >
                      <div className="fade-in">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/tools" element={<Tools />} />
                          <Route path="/tool/:id" element={<ToolDetails />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/login" element={<LoginForm />} />
                          <Route path="/register" element={<RegisterForm />} />
                          <Route path="/submit-tool" element={<SubmitTool />} />
                          <Route
                            path="/profile"
                            element={
                              <PrivateRoute>
                                <UserProfile />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/smart-prompts"
                            element={
                              <PrivateRoute>
                                <SmartPromptsPage />
                              </PrivateRoute>
                            }
                          />
                          {/* Dashboard Routes */}
                          <Route
                            path="/dashboard/*"
                            element={
                              <PrivateRoute>
                                <Dashboard />
                              </PrivateRoute>
                            }
                          >
                            <Route index element={<DashboardOverview />} />
                            <Route path="overview" element={<DashboardOverview />} />
                            <Route path="favorites" element={<FavoriteTools />} />
                            <Route path="submitted" element={<SubmittedTools />} />
                            <Route path="reviews" element={<Reviews />} />
                            <Route path="collections" element={<Collections />} />
                            <Route path="collections/:id" element={<CollectionView />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="api-keys" element={<ApiKeys />} />
                            <Route path="settings" element={<ProfileSettings />} />
                          </Route>
                          <Route 
                            path="*" 
                            element={
                              <div className="text-center py-16">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                                <button
                                  onClick={() => window.history.back()}
                                  className="btn btn-primary"
                                >
                                  Go Back
                                </button>
                              </div>
                            }
                          />
                        </Routes>
                      </div>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
                <Toaster 
                  position="bottom-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                  }}
                />
              </ErrorBoundary>
            </ToolsProvider>
          </Router>
        </AIProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App
