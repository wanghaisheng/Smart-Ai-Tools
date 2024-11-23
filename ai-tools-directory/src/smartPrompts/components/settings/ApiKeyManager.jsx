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

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-700'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

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
  const [enabledModels, setEnabledModels] = useState({});
  const [enabledProviders, setEnabledProviders] = useState({});

  useEffect(() => {
    loadApiKeys();
    loadEnabledModels();
    loadEnabledProviders();
  }, []);

  const loadEnabledProviders = async () => {
    try {
      const stored = localStorage.getItem('enabledProviders');
      if (stored) {
        setEnabledProviders(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading enabled providers:', error);
    }
  };

  const toggleProvider = async (providerId) => {
    try {
      const newEnabledProviders = {
        ...enabledProviders,
        [providerId]: !enabledProviders[providerId]
      };
      setEnabledProviders(newEnabledProviders);
      localStorage.setItem('enabledProviders', JSON.stringify(newEnabledProviders));

      // Toggle all models for this provider
      const providerModels = getAvailableModels(providerId);
      const newEnabledModels = {
        ...enabledModels,
        [providerId]: providerModels.reduce((acc, model) => ({
          ...acc,
          [model]: newEnabledProviders[providerId]
        }), {})
      };
      setEnabledModels(newEnabledModels);
      localStorage.setItem('enabledModels', JSON.stringify(newEnabledModels));

      toast.success(`${providerId} ${newEnabledProviders[providerId] ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling provider:', error);
      toast.error('Failed to update provider status');
    }
  };

  const isProviderEnabled = (providerId) => {
    return enabledProviders[providerId] || false;
  };

  const loadEnabledModels = async () => {
    try {
      const stored = localStorage.getItem('enabledModels');
      if (stored) {
        setEnabledModels(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading enabled models:', error);
    }
  };

  const toggleModel = async (providerId, modelName) => {
    try {
      const response = await fetch(`/api/provider-api-keys/${providerId}/models/${modelName}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle model');

      const data = await response.json();
      setApiKeys(prev => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          enabledModels: data.enabledModels
        }
      }));
    } catch (error) {
      console.error('Error toggling model:', error);
      toast.error('Failed to toggle model');
    }
  };

  const isModelEnabled = (providerId, modelName) => {
    return enabledModels[providerId]?.[modelName] || false;
  };

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/provider-api-keys', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
      const response = await fetch(`/api/provider-api-keys/${provider}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('API key test failed');
      
      const data = await response.json();
      if (data.isValid) {
        toast.success(`${provider} API key is valid`);
      } else {
        toast.error(`${provider} API key is invalid`);
      }
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
      const response = await fetch(`/api/provider-api-keys/${selectedProvider.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: newApiKey
        })
      });

      if (!response.ok) throw new Error('Failed to save API key');

      const data = await response.json();
      setApiKeys(prev => ({
        ...prev,
        [selectedProvider.id]: {
          isValid: data.isValid,
          isEnabled: data.isEnabled,
          enabledModels: data.enabledModels,
          lastTested: data.lastTested
        }
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
      const response = await fetch(`/api/provider-api-keys/${provider}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete API key');

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

  const renderSettingsContent = () => {
    if (selectedCategory === 'models') {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Enabled Models</h3>
          {Object.entries(apiKeys).map(([providerId, apiKey]) => {
            const provider = Object.values(MODEL_PROVIDERS)
              .flatMap(category => category.providers)
              .find(p => p.id === providerId);
            
            if (!provider || !apiKey) return null;

            return (
              <div key={providerId} className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <h4 className="text-md font-medium text-gray-300">{provider.name}</h4>
                <div className="space-y-2">
                  {getAvailableModels(providerId).map((modelName) => (
                    <div key={modelName} className="flex items-center justify-between py-2 px-3 bg-gray-700/30 rounded-lg">
                      <span className="text-sm text-gray-300">{modelName}</span>
                      <ToggleSwitch
                        enabled={isModelEnabled(providerId, modelName)}
                        onChange={() => toggleModel(providerId, modelName)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.keys(apiKeys).length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <KeyIcon className="h-12 w-12 mx-auto mb-3" />
              <p>No API keys configured. Add an API key to enable models.</p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
          <p>This section is under development</p>
        </div>
      </div>
    );
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
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {API_PROVIDERS.map((provider) => {
            const hasKey = apiKeys[provider.id];
            const isTesting = testing[provider.id];
            const modelCount = getAvailableModels(provider.id).length;

            return (
              <motion.div
                key={provider.id}
                whileHover={{ scale: 1.02 }}
                className={`relative p-4 rounded-xl border ${
                  hasKey ? 'border-green-500/30 bg-green-500/5' : 'border-gray-700 bg-gray-800/50'
                } hover:shadow-lg transition-all duration-200`}
              >
                {/* Provider Header */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-200">{provider.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                      {modelCount} {modelCount === 1 ? 'model' : 'models'}
                    </span>
                  </div>
                  
                  {/* Toggle All Section */}
                  <div className="flex items-center justify-between bg-gray-700/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${isProviderEnabled(provider.id) ? 'bg-blue-400' : 'bg-gray-500'}`} />
                      <span className="text-sm text-gray-300">
                        {isProviderEnabled(provider.id) ? 'All models enabled' : 'All models disabled'}
                      </span>
                    </div>
                    <ToggleSwitch
                      enabled={isProviderEnabled(provider.id)}
                      onChange={() => toggleProvider(provider.id)}
                    />
                  </div>
                </div>

                {/* API Key Status Bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <div className="h-1 rounded-full bg-gray-700">
                      <div
                        className={`h-1 rounded-full ${
                          hasKey ? 'bg-green-500' : 'bg-gray-600'
                        } transition-all duration-500`}
                        style={{ width: hasKey ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasKey ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-500">Connected</span>
                      </>
                    ) : (
                      <>
                        <KeyIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Not Connected</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    {hasKey && (
                      <button
                        onClick={() => testApiKey(provider.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                          isTesting
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        } transition-colors`}
                        disabled={isTesting}
                      >
                        {isTesting ? (
                          <>
                            <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {hasKey && (
                    <button
                      onClick={() => deleteApiKey(provider.id)}
                      className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  {hasKey && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      <span>Active</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
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

                    {/* Available Models with Toggles */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Available Models
                      </label>
                      <div className="grid gap-2">
                        {getAvailableModels(selectedProvider.id).map((model) => (
                          <div
                            key={model}
                            className="flex items-center justify-between px-3 py-2 bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                              <span className="text-sm text-gray-300">{model}</span>
                            </div>
                            <ToggleSwitch
                              enabled={isModelEnabled(selectedProvider.id, model)}
                              onChange={() => toggleModel(selectedProvider.id, model)}
                            />
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

      {/* Main Settings Content */}
      <div className="mt-6">
        {renderSettingsContent()}
      </div>
    </div>
  );
};

export default ApiKeyManager;
