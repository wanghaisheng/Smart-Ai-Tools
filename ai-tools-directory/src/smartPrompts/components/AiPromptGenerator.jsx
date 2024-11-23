import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  AdjustmentsHorizontalIcon,
  BookmarkIcon,
  ArrowPathIcon,
  BeakerIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const PROMPT_TYPES = [
  { id: 'creative', name: 'Creative Writing', icon: LightBulbIcon },
  { id: 'technical', name: 'Technical', icon: BeakerIcon },
  { id: 'marketing', name: 'Marketing', icon: BookmarkIcon },
  { id: 'academic', name: 'Academic', icon: BookmarkIcon },
];

const TONE_OPTIONS = [
  'Professional', 'Casual', 'Friendly', 'Formal', 
  'Authoritative', 'Humorous', 'Inspirational'
];

const LENGTH_OPTIONS = [
  { id: 'concise', name: 'Concise', tokens: 50 },
  { id: 'moderate', name: 'Moderate', tokens: 150 },
  { id: 'detailed', name: 'Detailed', tokens: 300 },
  { id: 'comprehensive', name: 'Comprehensive', tokens: 500 }
];

const AiPromptGenerator = ({ onSavePrompt }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [promptType, setPromptType] = useState('creative');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('moderate');
  const [temperature, setTemperature] = useState(0.7);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(0);

  // Load available AI models from configured API keys
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await api.get('/settings/available-models');
        const data = response.data;
        setAvailableModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].id);
        }
      } catch (error) {
        console.error('Error loading models:', error);
        toast.error('Failed to load available AI models');
      }
    };
    loadModels();
  }, []);

  const generatePrompt = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (!selectedModel) {
      toast.error('Please configure an AI model in settings');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/generate-prompt', {
        topic,
        model: selectedModel,
        type: promptType,
        tone,
        length,
        temperature,
        generateVariations: true
      });

      const data = response.data;
      if (!response.ok) throw new Error(data.message);

      setGeneratedPrompt(data.prompts[0]);
      setVariations(data.prompts);
      setSelectedVariation(0);
      toast.success('Prompt generated successfully!');
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedPrompt) return;
    
    onSavePrompt({
      title: `AI Generated: ${topic}`,
      content: generatedPrompt,
      category: 'AI Generated',
      tags: ['ai-generated', promptType, tone.toLowerCase(), topic.toLowerCase()],
      metadata: {
        model: selectedModel,
        type: promptType,
        tone,
        length,
        temperature
      },
      visibility: 'private'
    });
    
    toast.success('Prompt saved successfully!');
  };

  const selectVariation = (index) => {
    setSelectedVariation(index);
    setGeneratedPrompt(variations[index]);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-medium text-gray-300">
            AI Prompt Generator
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-600"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </motion.button>
        </div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-4"
          >
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AI Model
              </label>
              <select
                value={selectedModel || ''}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
              >
                {availableModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prompt Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PROMPT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setPromptType(type.id)}
                    className={`p-2 rounded-md flex items-center justify-center gap-2 ${
                      promptType === type.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
              >
                {TONE_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Length Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Length
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
              >
                {LENGTH_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name} (~{option.tokens} tokens)
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Creativity (Temperature): {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Focused</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., Creative writing, Technical documentation, Marketing copy..."
            className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePrompt}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <SparklesIcon className="h-5 w-5" />
            Generate
          </motion.button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Generating your prompt...</p>
        </div>
      )}

      {generatedPrompt && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          {variations.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Variations
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {variations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => selectVariation(index)}
                    className={`px-3 py-1 rounded-md flex items-center gap-1 ${
                      selectedVariation === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    Version {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Generated Prompt:</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{generatedPrompt}</p>
          </div>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Save Prompt
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePrompt}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Regenerate
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AiPromptGenerator;
