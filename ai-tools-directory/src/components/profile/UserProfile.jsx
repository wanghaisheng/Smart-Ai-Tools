import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiBookOpen, FiClock } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bio, setBio] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profiles/me');
      setProfile(response.data);
      setBio(response.data.bio || '');
      setError('');
    } catch (error) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', error.response?.data || error.message);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await api.patch('/profiles/me', { bio });
      setEditing(false);
      await fetchProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
      console.error('Profile update error:', error.response?.data || error.message);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
            >
              Your Profile
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-gray-500 dark:text-gray-400"
            >
              Manage your account and preferences
            </motion.p>
          </div>

          {/* Profile Content */}
          <motion.div
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={fetchProfile}
                  className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-primary-500 to-secondary-500">
                <div className="absolute -bottom-12 left-8">
                  <div className="relative">
                    <img
                      src={user?.avatar || 'https://via.placeholder.com/96'}
                      alt={user?.username}
                      className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                    />
                    {!editing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditing(true)}
                        className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-primary-500 hover:text-primary-600 dark:text-primary-400"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-8 px-8">
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <FiUser className="w-5 h-5 text-primary-500" />
                      <span className="font-medium">Username:</span>
                      <span>{user?.username}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <FiMail className="w-5 h-5 text-primary-500" />
                      <span className="font-medium">Email:</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <FiClock className="w-5 h-5 text-primary-500" />
                      <span className="font-medium">Member since:</span>
                      <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                        <FiBookOpen className="w-5 h-5 text-primary-500" />
                        <span className="font-medium">Bio</span>
                      </div>
                      {editing ? (
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                          >
                            <FiSave className="w-4 h-4 mr-1.5" />
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditing(false);
                              setBio(profile.bio || '');
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <FiX className="w-4 h-4 mr-1.5" />
                            Cancel
                          </motion.button>
                        </div>
                      ) : null}
                    </div>
                    {editing ? (
                      <div className="mt-2">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {bio || 'No bio added yet.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
