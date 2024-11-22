import { determinePricingTier, getPricingBadgeColor, formatPricingTier } from '../utils/pricingUtils';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { FavoriteButton } from './index';

export default function ToolCard({ tool }) {
  const {
    _id,
    name,
    description,
    categories = [],
    url,
    image,
    favoriteCount = 0
  } = tool;

  const pricingTier = determinePricingTier(tool);
  const badgeColor = getPricingBadgeColor(pricingTier);
  const pricingDisplay = formatPricingTier(pricingTier);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={image || 'https://via.placeholder.com/400x225?text=AI+Tool'}
            alt={name}
            className="w-full h-full object-cover"
          />
          {/* Favorite Button Overlay */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton
              toolId={_id}
              initialCount={favoriteCount}
              className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <Link to={`/tool/${_id}`} className="block">
            <div className="flex justify-between items-start gap-2 mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {name}
              </h3>
              <span className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${badgeColor}`}>
                {pricingDisplay}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[2.5rem] mb-4">
              {description}
            </p>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[1.75rem]">
              {categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </Link>

          {/* Footer with Visit Website Link */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Visit Website
              <FiExternalLink className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
