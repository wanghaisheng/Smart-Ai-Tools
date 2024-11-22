import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function SubmittedTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmittedTools();
    }
  }, [isAuthenticated]);

  const fetchSubmittedTools = async () => {
    try {
      const response = await api.get('/tools/submitted');
      setTools(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch submitted tools';
      toast.error(errorMessage);
      console.error('Error fetching submitted tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toolId) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return;

    try {
      await api.delete(`/tools/${toolId}`);
      toast.success('Tool deleted successfully');
      setTools(tools.filter(tool => tool._id !== toolId));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete tool';
      toast.error(errorMessage);
      console.error('Error deleting tool:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submitted Tools</h2>
        <Link
          to="/submit-tool"
          className="btn btn-primary"
        >
          Submit New Tool
        </Link>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">You haven't submitted any tools yet.</p>
          <Link
            to="/submit-tool"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Submit your first tool
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <motion.div
              key={tool._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tool.status === 'approved' ? 'bg-green-100 text-green-800' :
                    tool.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/tool/${tool._id}`}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <FiEye className="w-5 h-5" />
                  </Link>
                  <Link
                    to={`/edit-tool/${tool._id}`}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(tool._id)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
