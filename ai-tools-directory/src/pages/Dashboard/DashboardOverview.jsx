import { useState, useEffect } from 'react';
import { FiHeart, FiStar, FiTool, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const statsCards = [
  { id: 'favorites', label: 'Favorite Tools', icon: FiHeart, color: 'text-pink-500' },
  { id: 'reviews', label: 'Reviews Given', icon: FiStar, color: 'text-yellow-500' },
  { id: 'submitted', label: 'Tools Submitted', icon: FiTool, color: 'text-blue-500' },
  { id: 'collections', label: 'Collections', icon: FiClock, color: 'text-purple-500' },
];

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    favorites: 0,
    reviews: 0,
    submitted: 0,
    collections: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/users/activity')
        ]);
        setStats(statsRes.data);
        setRecentActivity(activityRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.label}
                  </p>
                  <h4 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {stats[card.id]}
                  </h4>
                </div>
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((activity) => (
            <div
              key={activity._id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span
                  className={`p-2 rounded-full ${
                    activity.type === 'favorite'
                      ? 'bg-pink-100 text-pink-500 dark:bg-pink-900/30'
                      : activity.type === 'review'
                      ? 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900/30'
                      : activity.type === 'submit'
                      ? 'bg-blue-100 text-blue-500 dark:bg-blue-900/30'
                      : 'bg-purple-100 text-purple-500 dark:bg-purple-900/30'
                  }`}
                >
                  {activity.type === 'favorite' && <FiHeart className="w-4 h-4" />}
                  {activity.type === 'review' && <FiStar className="w-4 h-4" />}
                  {activity.type === 'submit' && <FiTool className="w-4 h-4" />}
                  {activity.type === 'collection' && <FiClock className="w-4 h-4" />}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
