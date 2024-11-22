import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiGlobe, FiLock } from 'react-icons/fi';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CollectionView() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const fetchCollection = async () => {
    try {
      const response = await api.get(`/collections/${id}`);
      setCollection(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching collection:', error);
      setError(error.response?.data?.message || 'Failed to fetch collection');
      toast.error('Failed to fetch collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;

    try {
      await api.delete(`/collections/${id}`);
      toast.success('Collection deleted successfully');
      window.history.back();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Link
          to="/dashboard/collections"
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <FiArrowLeft className="mr-2" /> Back to Collections
        </Link>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Collection Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The collection you're looking for doesn't exist.</p>
        <Link
          to="/dashboard/collections"
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <FiArrowLeft className="mr-2" /> Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/collections"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <FiArrowLeft className="mr-2" /> Back to Collections
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to={`/dashboard/collections/${id}/edit`}
            className="btn btn-secondary inline-flex items-center"
          >
            <FiEdit2 className="mr-2" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger inline-flex items-center"
          >
            <FiTrash2 className="mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {collection.name}
            </h1>
            {collection.isPublic ? (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <FiGlobe className="mr-2" /> Public
              </div>
            ) : (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <FiLock className="mr-2" /> Private
              </div>
            )}
          </div>
          
          {collection.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {collection.description}
            </p>
          )}

          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tools in Collection ({collection.tools?.length || 0})
            </h2>
            
            {collection.tools?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {collection.tools.map((tool) => (
                  <Link
                    key={tool._id}
                    to={`/tool/${tool._id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No tools in this collection yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
