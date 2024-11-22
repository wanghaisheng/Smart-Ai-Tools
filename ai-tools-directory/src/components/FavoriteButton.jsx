import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../hooks/useFavorites';
import { motion } from 'framer-motion';

export default function FavoriteButton({ toolId, initialCount = 0, className = '' }) {
  const { favoriteTools, checkFavoriteStatus, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState({
    isFavorited: false,
    favoriteCount: initialCount
  });

  useEffect(() => {
    const status = favoriteTools.get(toolId);
    if (status) {
      setFavoriteStatus(status);
    } else {
      checkFavoriteStatus(toolId).then(setFavoriteStatus);
    }
  }, [toolId, favoriteTools, checkFavoriteStatus]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Prevent link navigation if button is inside a link
    if (isLoading) return;

    setIsLoading(true);
    const result = await toggleFavorite(toolId);
    if (result) {
      setFavoriteStatus(result);
    }
    setIsLoading(false);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`group relative flex items-center space-x-1 ${className}`}
      aria-label={favoriteStatus.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FiHeart
        className={`w-5 h-5 transition-colors duration-200 ${
          favoriteStatus.isFavorited
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 group-hover:text-red-500'
        }`}
        style={{
          fill: favoriteStatus.isFavorited ? 'currentColor' : 'none'
        }}
      />
      {favoriteStatus.favoriteCount > 0 && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {favoriteStatus.favoriteCount}
        </span>
      )}
    </motion.button>
  );
}
