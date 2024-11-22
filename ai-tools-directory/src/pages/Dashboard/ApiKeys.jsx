import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiKey, FiPlus, FiTrash2, FiCopy, FiCheck } from 'react-icons/fi';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await api.get('/api-keys');
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api-keys', { name: newKeyName });
      // Store the newly created key with its token
      setNewlyCreatedKey(response.data);
      // Add the key to the list without the token
      setApiKeys([{ 
        _id: response.data._id,
        name: response.data.name,
        createdAt: response.data.createdAt
      }, ...apiKeys]);
      setNewKeyName('');
      setShowCreateModal(false);
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error(error.response?.data?.message || 'Failed to create API key');
    }
  };

  const handleDeleteKey = async (keyId) => {
    try {
      await api.delete(`/api-keys/${keyId}`);
      setApiKeys(apiKeys.filter(key => key._id !== keyId));
      if (newlyCreatedKey?._id === keyId) {
        setNewlyCreatedKey(null);
      }
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error(error.response?.data?.message || 'Failed to delete API key');
    }
  };

  const handleCopyKey = (key) => {
    const token = newlyCreatedKey?._id === key._id ? newlyCreatedKey.token : null;
    if (!token) {
      toast.error('Token is only available immediately after creation');
      return;
    }
    navigator.clipboard.writeText(token);
    setCopiedKey(key._id);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create New Key</span>
        </button>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FiKey className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">No API keys yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create one to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <motion.div
              key={key._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{key.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created on {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyKey(key)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    title={newlyCreatedKey?._id === key._id ? "Copy API key" : "Token only available after creation"}
                  >
                    {copiedKey === key._id ? (
                      <FiCheck className="w-4 h-4" />
                    ) : (
                      <FiCopy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteKey(key._id)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {newlyCreatedKey?._id === key._id && (
                <div className="mt-2">
                  <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">
                    ⚠️ Copy this key now. You won't be able to see it again!
                  </p>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block overflow-x-auto">
                    {newlyCreatedKey.token}
                  </code>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New API Key</h3>
            <form onSubmit={handleCreateKey}>
              <div className="mb-4">
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Name
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter key name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
