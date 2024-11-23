import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
  CircleStackIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const SETTINGS_CATEGORIES = [
  { id: 'models', name: 'Default Model', icon: KeyIcon },
  { id: 'general', name: 'General Settings', icon: Cog6ToothIcon },
  { id: 'keyboard', name: 'Keyboard Shortcuts', icon: CommandLineIcon },
  { id: 'data', name: 'Data Settings', icon: CircleStackIcon },
  { id: 'about', name: 'About & Feedback', icon: InformationCircleIcon },
];

const MODEL_PROVIDERS = {
  popular: {
    title: 'Popular',
    providers: [
      { id: 'openai', name: 'OpenAI', key: 'OPENAI_API_KEY' },
      { id: 'anthropic', name: 'Anthropic', key: 'ANTHROPIC_API_KEY' },
      { id: 'gemini', name: 'Gemini', key: 'GOOGLE_API_KEY' },
      { id: 'groq', name: 'Groq', key: 'GROQ_API_KEY' },
      { id: 'mistral', name: 'Mistral', key: 'MISTRAL_API_KEY' },
    ]
  },
  cloud: {
    title: 'Cloud Providers',
    providers: [
      { id: 'azure', name: 'Azure OpenAI', key: 'AZURE_API_KEY' },
      { id: 'alibaba', name: 'Alibaba Cloud', key: 'ALIBABA_API_KEY' },
      { id: 'tencent', name: 'Tencent Hunyuan', key: 'TENCENT_API_KEY' },
      { id: 'nvidia', name: 'Nvidia', key: 'NVIDIA_API_KEY' },
    ]
  },
  opensource: {
    title: 'Open Source',
    providers: [
      { id: 'ollama', name: 'Ollama', key: 'OLLAMA_API_KEY' },
      { id: 'huggingface', name: 'Hugging Face', key: 'HUGGINGFACE_API_KEY' },
      { id: 'replicate', name: 'Replicate', key: 'REPLICATE_API_KEY' },
      { id: 'together', name: 'Together', key: 'TOGETHER_API_KEY' },
    ]
  },
  other: {
    title: 'Other Providers',
    providers: [
      { id: 'cohere', name: 'Cohere', key: 'COHERE_API_KEY' },
      { id: 'openrouter', name: 'OpenRouter', key: 'OPENROUTER_API_KEY' },
      { id: 'deepseek', name: 'DeepSeek', key: 'DEEPSEEK_API_KEY' },
      { id: 'fireworks', name: 'Fireworks', key: 'FIREWORKS_API_KEY' },
      { id: 'grok', name: 'Grok', key: 'GROK_API_KEY' },
      { id: 'moonshot', name: 'Moonshot', key: 'MOONSHOT_API_KEY' },
      { id: 'zhipu', name: 'ZHIPU AI', key: 'ZHIPU_API_KEY' },
      { id: 'yi', name: 'Yi', key: 'YI_API_KEY' },
      { id: 'ocool', name: 'ocoolAI', key: 'OCOOL_API_KEY' },
      { id: 'graphrag', name: 'GraphRAG', key: 'GRAPHRAG_API_KEY' },
      { id: 'minimax', name: 'MiniMax', key: 'MINIMAX_API_KEY' },
      { id: 'stepfun', name: 'StepFun', key: 'STEPFUN_API_KEY' },
      { id: 'doubao', name: 'Doubao', key: 'DOUBAO_API_KEY' },
      { id: 'hyperbolic', name: 'Hyperbolic', key: 'HYPERBOLIC_API_KEY' },
      { id: 'aihubmix', name: 'AiHubMix', key: 'AIHUBMIX_API_KEY' },
    ]
  }
};

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
  const [selectedCategory, setSelectedCategory] = useState('models');
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

  const getAvailableModels = (provider) => {
    switch (provider) {
      case 'openai':
        return ['GPT-4 Turbo', 'GPT-4', 'GPT-3.5 Turbo'];
      case 'anthropic':
        return ['Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku'];
      case 'gemini':
        return ['Gemini Pro', 'Gemini Ultra'];
      case 'groq':
        return ['Mixtral-8x7B', 'LLaMA-2-70B'];
      default:
        return [];
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

      {/* Three Column Add Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl shadow-xl w-[1000px] max-w-[90vw] max-h-[80vh] overflow-hidden"
          >
            <div className="grid grid-cols-[250px_300px_1fr] h-full">
              {/* Column 1: Categories */}
              <div className="bg-gray-900/50 border-r border-gray-700/50 p-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Settings</h3>
                <nav className="space-y-1">
                  {SETTINGS_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                      }`}
                    >
                      <category.icon className="h-5 w-5" />
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Column 2: Model Providers */}
              <div className="border-r border-gray-700/50 p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Model Providers</h3>
                <div className="space-y-6">
                  {Object.entries(MODEL_PROVIDERS).map(([key, section]) => (
                    <div key={key}>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">{section.title}</h4>
                      <div className="space-y-1">
                        {section.providers.map((provider) => (
                          <button
                            key={provider.id}
                            onClick={() => setSelectedProvider(provider)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedProvider?.id === provider.id
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                            }`}
                          >
                            {provider.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: API Key Configuration */}
              <div className="p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  {selectedProvider ? `Configure ${selectedProvider.name}` : 'Select a Provider'}
                </h3>
                
                {selectedProvider ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder={`Enter ${selectedProvider.name} API key`}
                        className="w-full bg-gray-700 border-gray-600 rounded-lg text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-400">
                        Your API key will be encrypted and stored securely
                      </p>
                    </div>

                    {/* Available Models */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Available Models
                      </label>
                      <div className="grid gap-2">
                        {getAvailableModels(selectedProvider.id).map((model) => (
                          <div
                            key={model}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg"
                          >
                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm text-gray-300">{model}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
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
                        disabled={!newApiKey.trim()}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Key
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <KeyIcon className="h-12 w-12 mb-4" />
                    <p>Select a provider to configure API key</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
