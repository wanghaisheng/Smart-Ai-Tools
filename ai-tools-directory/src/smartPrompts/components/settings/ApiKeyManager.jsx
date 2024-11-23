import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const API_PROVIDERS = [
  { 
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-3.5-turbo', 'davinci-003'],
    placeholder: 'sk-...',
    description: 'Powers GPT-4 and GPT-3.5 models'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-2', 'claude-instant'],
    placeholder: 'sk-ant-...',
    description: 'Powers Claude models'
  },
  {
    id: 'cohere',
    name: 'Cohere',
    models: ['command', 'command-light'],
    placeholder: 'co-...',
    description: 'Specialized in text generation and analysis'
  },
  {
    id: 'stability',
    name: 'Stability AI',
    models: ['stable-diffusion-xl'],
    placeholder: 'sk-...',
    description: 'Powers image generation models'
  }
];

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [newApiKey, setNewApiKey] = useState('');

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/settings/api-keys');
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const testApiKey = async (provider) => {
    setTesting(prev => ({ ...prev, [provider]: true }));
    try {
      const response = await fetch('/api/settings/test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: apiKeys[provider]
        })
      });
      
      if (!response.ok) throw new Error('API key test failed');
      
      toast.success(`${provider} API key is valid`);
    } catch (error) {
      console.error('Error testing API key:', error);
      toast.error(`Failed to validate ${provider} API key`);
    } finally {
      setTesting(prev => ({ ...prev, [provider]: false }));
    }
  };

  const saveApiKey = async () => {
    if (!selectedProvider || !newApiKey.trim()) {
      toast.error('Please select a provider and enter an API key');
      return;
    }

    try {
      const response = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider.id,
          apiKey: newApiKey
        })
      });

      if (!response.ok) throw new Error('Failed to save API key');

      setApiKeys(prev => ({
        ...prev,
        [selectedProvider.id]: newApiKey
      }));

      toast.success('API key saved successfully');
      setShowAddModal(false);
      setNewApiKey('');
      setSelectedProvider(null);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    }
  };

  const deleteApiKey = async (provider) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) return;

    try {
      await fetch('/api/settings/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });

      setApiKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[provider];
        return newKeys;
      });

      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">API Key Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add API Key
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {API_PROVIDERS.map(provider => (
            <div
              key={provider.id}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-200">{provider.name}</h3>
                <p className="text-sm text-gray-400">{provider.description}</p>
                <div className="mt-1 text-sm text-gray-400">
                  Models: {provider.models.join(', ')}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {apiKeys[provider.id] ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => testApiKey(provider.id)}
                      disabled={testing[provider.id]}
                      className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteApiKey(provider.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md flex items-center gap-2 hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </motion.button>
                  </>
                ) : (
                  <span className="text-yellow-500 flex items-center gap-2">
                    <ExclamationCircleIcon className="h-5 w-5" />
                    Not configured
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add API Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Add New API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Provider
                </label>
                <select
                  value={selectedProvider?.id || ''}
                  onChange={(e) => setSelectedProvider(
                    API_PROVIDERS.find(p => p.id === e.target.value)
                  )}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
                >
                  <option value="">Select a provider...</option>
                  {API_PROVIDERS.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProvider && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder={selectedProvider.placeholder}
                    className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewApiKey('');
                  setSelectedProvider(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveApiKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save API Key
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
