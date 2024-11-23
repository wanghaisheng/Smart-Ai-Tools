import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const API_PROVIDERS = [
  { 
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-3.5-turbo', 'davinci-003'],
    placeholder: 'sk-...',
    description: 'Powers GPT-4 and GPT-3.5 models',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-2', 'claude-instant'],
    placeholder: 'sk-ant-...',
    description: 'Powers Claude models',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'cohere',
    name: 'Cohere',
    models: ['command', 'command-light'],
    placeholder: 'co-...',
    description: 'Specialized in text generation and analysis',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'stability',
    name: 'Stability AI',
    models: ['stable-diffusion-xl'],
    placeholder: 'sk-...',
    description: 'Powers image generation models',
    color: 'from-orange-500 to-red-500'
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
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <KeyIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-200">API Keys</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Key
        </motion.button>
      </div>

      {/* API Provider Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-800/50 rounded-xl p-4 h-32"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {API_PROVIDERS.map((provider) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-xl ${provider.color}"></div>
              <div className="relative bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-200">{provider.name}</h4>
                  {apiKeys[provider.id] && (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => testApiKey(provider.id)}
                        disabled={testing[provider.id]}
                        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        title="Test API Key"
                      >
                        {testing[provider.id] ? (
                          <ArrowPathIcon className="h-4 w-4 text-gray-400 animate-spin" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4 text-green-400" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteApiKey(provider.id)}
                        className="p-1 rounded-full bg-gray-700 hover:bg-red-600 transition-colors"
                        title="Delete API Key"
                      >
                        <TrashIcon className="h-4 w-4 text-gray-400 group-hover:text-white" />
                      </motion.button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 mb-2">{provider.description}</p>
                
                {apiKeys[provider.id] ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400">Configured</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-400">Not Configured</span>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  {provider.models.join(', ')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add API Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Add API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Select Provider
                </label>
                <select
                  value={selectedProvider?.id || ''}
                  onChange={(e) => setSelectedProvider(API_PROVIDERS.find(p => p.id === e.target.value))}
                  className="w-full bg-gray-700 border-gray-600 rounded-lg text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a provider...</option>
                  {API_PROVIDERS.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder={selectedProvider?.placeholder || 'Enter API key...'}
                  className="w-full bg-gray-700 border-gray-600 rounded-lg text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedProvider(null);
                  setNewApiKey('');
                }}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveApiKey}
                disabled={!selectedProvider || !newApiKey.trim()}
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Key
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
