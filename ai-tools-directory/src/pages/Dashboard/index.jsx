import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiGrid, FiHeart, FiList, FiSettings, FiStar, FiTool, FiKey, FiBell, FiMenu, FiX } from 'react-icons/fi';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'favorites', label: 'Favorite Tools', icon: FiHeart },
  { id: 'submitted', label: 'Submitted Tools', icon: FiTool },
  { id: 'reviews', label: 'My Reviews', icon: FiStar },
  { id: 'collections', label: 'Collections', icon: FiList },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'api-keys', label: 'API Keys', icon: FiKey },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const validTab = menuItems.find(item => item.id === path);
    setActiveTab(validTab ? path : 'overview');
  }, [location]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/dashboard/${tabId}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="h-full flex flex-col">
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    activeTab === item.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="h-16 px-4 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h1>
            <div className="flex items-center space-x-4">
              {/* Add any header actions here */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
