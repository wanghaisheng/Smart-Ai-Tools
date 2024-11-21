import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiStar, FiShare2, FiBookmark, FiMessageCircle } from 'react-icons/fi';
import { useTools } from '../contexts/ToolsContext';
import { determinePricingTier, getPricingBadgeColor, formatPricingTier } from '../utils/pricingUtils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ToolDetails() {
  const { id } = useParams();
  const { currentTool, getTool, loading, error } = useTools();

  useEffect(() => {
    if (id) {
      getTool(id);
      window.scrollTo(0, 0);
    }
  }, [id, getTool]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Tool</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
            <Link
              to="/tools"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back to Tools
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentTool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tool Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The tool you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back to Tools
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const pricingTier = determinePricingTier(currentTool);
  const badgeColor = getPricingBadgeColor(pricingTier);
  const pricingDisplay = formatPricingTier(pricingTier);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/tools"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentTool.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
                  {pricingDisplay}
                </span>
              </div>
              
              {currentTool.image && (
                <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
                  <img
                    src={currentTool.image}
                    alt={currentTool.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {currentTool.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                {currentTool.categories?.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-yellow-400">
                    <FiStar className="h-5 w-5 fill-current" />
                    <span className="ml-1 text-gray-600 dark:text-gray-300">
                      {currentTool.rating?.average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FiMessageCircle className="h-5 w-5" />
                    <span className="ml-1">
                      {currentTool.reviews?.length || 0} reviews
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <FiBookmark className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <FiShare2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Features Section */}
            <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Features</h2>
              <ul className="space-y-3">
                {currentTool.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                      ✓
                    </span>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div variants={fadeIn} className="space-y-6">
            {/* Action Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
              <a
                href={currentTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
              >
                Visit Website
                <FiExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>

            {/* Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tool Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Added</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {new Date(currentTool.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {new Date(currentTool.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {currentTool.categories?.[0]}
                  </dd>
                </div>
                {currentTool.pricing && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pricing</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {currentTool.pricing}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
