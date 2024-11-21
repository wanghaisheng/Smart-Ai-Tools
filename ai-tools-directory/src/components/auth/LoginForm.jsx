import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-gray-500 dark:text-gray-400"
            >
              Sign in to access your AI Tools account
            </motion.p>
          </div>

          {/* Form */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLogIn className="h-4 w-4 mr-2" />
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </motion.div>

              {/* Register Link */}
              <div className="text-sm text-center">
                <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Register now
                </Link>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
