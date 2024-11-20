import { determinePricingTier, getPricingBadgeColor, formatPricingTier } from '../utils/pricingUtils';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

export default function ToolCard({ tool }) {
  const {
    id,
    name,
    description,
    categories = [],
    url,
    image
  } = tool;

  const pricingTier = determinePricingTier(tool);
  const badgeColor = getPricingBadgeColor(pricingTier);
  const pricingDisplay = formatPricingTier(pricingTier);

  return (
    <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={image || 'https://via.placeholder.com/400x225?text=AI+Tool'}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {name}
          </h3>
          <span className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${badgeColor}`}>
            {pricingDisplay}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] mb-4">
          {description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[1.75rem]">
          {categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
            >
              {category}
            </span>
          ))}
          {categories.length > 2 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              +{categories.length - 2}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Link
            to={`/tool/${id}`}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Details
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Visit <FiExternalLink className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
