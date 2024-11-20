import { useParams, Link } from 'react-router-dom';
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
  const { tools } = useTools();
  const tool = tools.find(t => t.id === id);

  if (!tool) {
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

  const pricingTier = determinePricingTier(tool);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
            <p className="text-lg text-gray-600">{tool.description}</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${badgeColor}`}>
              {pricingDisplay}
            </span>
            <a
              href={tool.url}
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
            {tool.image && (
              <div className="rounded-lg overflow-hidden mb-8 max-w-2xl mx-auto">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {tool.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            {tool.features && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {tool.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tool Information</h2>
            <dl className="space-y-4">
              {tool.rating && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {tool.rating.toFixed(1)} / 5.0
                  </dd>
                </div>
              )}
              {tool.reviewCount && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reviews</dt>
                  <dd className="mt-1 text-sm text-gray-900">{tool.reviewCount}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Pricing</dt>
                <dd className="mt-1 text-sm text-gray-900">{pricingDisplay}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
