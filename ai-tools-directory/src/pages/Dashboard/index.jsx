import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiGrid, FiHeart, FiList, FiSettings, FiStar, FiTool, FiKey, FiBell } from 'react-icons/fi';
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

  // Sync activeTab with URL on mount and navigation
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const validTab = menuItems.find(item => item.id === path);
    setActiveTab(validTab ? path : 'overview');
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/dashboard/${tabId}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } lg:block lg:w-64 bg-white dark:bg-gray-800 h-screen fixed lg:sticky top-0 left-0 overflow-y-auto z-10 transition-all duration-300`}
        >
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 p-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
