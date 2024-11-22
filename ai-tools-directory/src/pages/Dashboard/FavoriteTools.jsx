import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2, FiExternalLink, FiFolder } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

export default function FavoriteTools() {
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTools, setSelectedTools] = useState(new Set());
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const [favoritesRes, collectionsRes] = await Promise.all([
          api.get('/favorites/my'),
          api.get('/collections')
        ]);
        setFavorites(favoritesRes.data);
        setCollections(collectionsRes.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorite tools');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleSelect = (toolId) => {
    setSelectedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const handleRemoveFavorites = async () => {
    try {
      await Promise.all(
        Array.from(selectedTools).map(toolId =>
          api.post(`/favorites/toggle/${toolId}`)
        )
      );
      
      setFavorites(prev => prev.filter(tool => !selectedTools.has(tool._id)));
      setSelectedTools(new Set());
      toast.success('Tools removed from favorites');
    } catch (error) {
      console.error('Error removing favorites:', error);
      toast.error('Failed to remove tools from favorites');
    }
  };

  const handleAddToCollection = async (collectionId) => {
    try {
      await api.post(`/collections/${collectionId}/add`, {
        tools: Array.from(selectedTools)
      });
      setSelectedTools(new Set());
      setShowCollectionModal(false);
      toast.success('Tools added to collection');
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast.error('Failed to add tools to collection');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Favorite Tools
        </h2>
        {selectedTools.size > 0 && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCollectionModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiFolder className="w-4 h-4 mr-2" />
              Add to Collection
            </button>
            <button
              onClick={handleRemoveFavorites}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              Remove Selected
            </button>
          </div>
        )}
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((tool) => (
          <motion.div
            key={tool._id}
            whileHover={{ y: -2 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Checkbox overlay */}
            <div className="absolute top-3 left-3 z-10">
              <input
                type="checkbox"
                checked={selectedTools.has(tool._id)}
                onChange={() => handleToggleSelect(tool._id)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>

            <img
              src={tool.image}
              alt={tool.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FiHeart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tool.favoriteCount}
                  </span>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Visit
                  <FiExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add to Collection
            </h3>
            <div className="space-y-2">
              {collections.map((collection) => (
                <button
                  key={collection._id}
                  onClick={() => handleAddToCollection(collection._id)}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiFolder className="w-4 h-4 mr-2" />
                  {collection.name}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowCollectionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
