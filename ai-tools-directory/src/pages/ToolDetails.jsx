import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { useTools } from '../contexts/ToolsContext';
import { determinePricingTier, getPricingBadgeColor, formatPricingTier } from '../utils/pricingUtils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ToolDetails() {
  const { id } = useParams();
  const { currentTool, loadToolDetails, loading, error } = useTools();

  useEffect(() => {
    if (id) {
      loadToolDetails(id);
    }
  }, [id, loadToolDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-red-600">Error Loading Tool</h2>
          <p className="mt-4 text-lg text-gray-500">{error}</p>
          <div className="mt-8">
            <Link
              to="/tools"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiArrowLeft className="mr-2" />
              Back to Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTool) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Tool Not Found</h2>
          <p className="mt-4 text-lg text-gray-500">
            The tool you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-8">
            <Link
              to="/tools"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiArrowLeft className="mr-2" />
              Back to Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pricingTier = determinePricingTier(currentTool);
  const badgeColor = getPricingBadgeColor(pricingTier);
  const pricingDisplay = formatPricingTier(pricingTier);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/tools"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentTool.name}</h1>
            <p className="text-lg text-gray-600">{currentTool.description}</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${badgeColor}`}>
              {pricingDisplay}
            </span>
            <a
              href={currentTool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Visit Tool <FiExternalLink className="ml-2" />
            </a>
          </div>
        </div>

        {/* Tool Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Preview Image */}
            {currentTool.image && (
              <div className="rounded-lg overflow-hidden mb-8 max-w-2xl mx-auto">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={currentTool.image}
                    alt={currentTool.name}
                    className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {currentTool.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Features or Additional Info */}
            {currentTool.features && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {currentTool.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Type</span>
                  <p className="mt-1 text-gray-900">{pricingDisplay}</p>
                </div>
                {currentTool.pricing && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Details</span>
                    <p className="mt-1 text-gray-900">{currentTool.pricing}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
