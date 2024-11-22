import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiGrid, FiHeart, FiList, FiSettings, FiStar, FiTool, FiKey, FiBell } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import FavoriteTools from './FavoriteTools';
import SubmittedTools from './SubmittedTools';
import ProfileSettings from './ProfileSettings';
import Reviews from './Reviews';
import Collections from './Collections';
import Notifications from './Notifications';
import ApiKeys from './ApiKeys';

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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'favorites':
        return <FavoriteTools />;
      case 'submitted':
        return <SubmittedTools />;
      case 'reviews':
        return <Reviews />;
      case 'collections':
        return <Collections />;
      case 'notifications':
        return <Notifications />;
      case 'api-keys':
        return <ApiKeys />;
      case 'settings':
        return <ProfileSettings />;
      default:
        return <DashboardOverview />;
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div
            className={`${
              isMobileMenuOpen ? 'fixed inset-0 z-10 bg-gray-900 bg-opacity-50' : 'hidden'
            } lg:relative lg:block lg:w-64 lg:flex-shrink-0`}
          >
            <div
              className={`${
                isMobileMenuOpen
                  ? 'absolute inset-y-0 left-0 w-64 transform translate-x-0 transition-transform ease-in-out duration-300'
                  : 'transform -translate-x-full lg:transform-none'
              } lg:relative lg:translate-x-0`}
            >
              <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40'}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user?.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
