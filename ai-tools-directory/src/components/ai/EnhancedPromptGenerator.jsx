import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BeakerIcon, AdjustmentsHorizontalIcon, DocumentDuplicateIcon,
  LightBulbIcon, ArrowPathIcon, BookmarkIcon, ShareIcon
} from '@heroicons/react/24/outline';
import { useAI } from '../../contexts/AIContext';
import { useAuth } from '../../contexts/AuthContext';
import PromptModelSelector from './prompt/PromptModelSelector';
import ContextualControls from './prompt/ContextualControls';
import OutputFormatting from './prompt/OutputFormatting';
import QualityMetrics from './prompt/QualityMetrics';
import PromptTemplates from './prompt/PromptTemplates';
import { toast } from 'react-hot-toast';

const EnhancedPromptGenerator = () => {
  // Core States
  const [prompt, setPrompt] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(0);
  const abortController = useRef(null);

  // Advanced Configuration States
  const [config, setConfig] = useState({
    models: {
      primary: 'gpt-4',
      secondary: ['claude-2', 'palm-2'],
      chainModels: true
    },
    context: {
      domain: 'general',
      industry: 'tech',
      audience: 'expert',
      locale: 'en-US'
    },
    parameters: {
      temperature: 0.7,
      topP: 0.9,
      presencePenalty: 0.6,
      frequencyPenalty: 0.3,
      maxTokens: 2000
    },
    features: {
      chainOfThought: true,
      fewShotLearning: true,
      constraintSatisfaction: true,
      factChecking: true,
      biasDetection: true
    },
    output: {
      format: 'markdown',
      includeMetadata: true,
      includeReasoning: true,
      includeAlternatives: true
    }
  });

  // Custom Hooks
  const { user } = useAuth();
  const { generateEnhancedPrompt, analyzePromptQuality } = useAI();

  // Prompt Generation Pipeline
  const generatePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt topic or description');
      return;
    }

    try {
      setIsGenerating(true);
      abortController.current = new AbortController();

      // Step 1: Initial prompt generation with primary model
      const initialPrompt = await generateEnhancedPrompt({
        input: prompt,
        model: config.models.primary,
        ...config.parameters
      }, abortController.current.signal);

      // Step 2: Quality analysis and enhancement
      const qualityMetrics = await analyzePromptQuality(initialPrompt);
      
      // Step 3: Iterative improvement if needed
      let enhancedPrompts = [initialPrompt];
      if (config.models.chainModels && qualityMetrics.score < 0.8) {
        for (const model of config.models.secondary) {
          const enhancedVersion = await generateEnhancedPrompt({
            input: initialPrompt,
            model,
            context: qualityMetrics.suggestions,
            ...config.parameters
          }, abortController.current.signal);
          enhancedPrompts.push(enhancedVersion);
        }
      }

      // Step 4: Apply post-processing and formatting
      const processedPrompts = enhancedPrompts.map(p => ({
        content: p,
        metadata: {
          quality: qualityMetrics,
          model: config.models.primary,
          timestamp: new Date(),
          context: config.context
        }
      }));

      setGeneratedPrompts(processedPrompts);
      setSelectedVersion(0);
      toast.success('Generated high-quality prompts!');
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Prompt generation cancelled');
      } else {
        console.error('Error generating prompt:', error);
        toast.error('Failed to generate prompt');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle configuration updates
  const updateConfig = useCallback((section, updates) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  }, []);

  // Cancel ongoing generation
  const cancelGeneration = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  };

  // Save prompt to library
  const savePrompt = async () => {
    if (!user) {
      toast.error('Please login to save prompts');
      return;
    }

    try {
      const selectedPrompt = generatedPrompts[selectedVersion];
      await savePromptToLibrary({
        content: selectedPrompt.content,
        metadata: selectedPrompt.metadata,
        config: config
      });
      toast.success('Prompt saved to your library');
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <BeakerIcon className="h-6 w-6 mr-2" />
          Advanced AI Prompt Generator
        </h2>
        <p className="text-gray-400">
          Generate high-quality, context-aware prompts with advanced AI capabilities
        </p>
      </div>

      {/* Main Input Section */}
      <div className="mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your prompt requirements..."
          className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Advanced Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PromptModelSelector
          config={config.models}
          onChange={(updates) => updateConfig('models', updates)}
        />
        <ContextualControls
          config={config.context}
          onChange={(updates) => updateConfig('context', updates)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePrompt}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? (
            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <LightBulbIcon className="h-5 w-5 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Prompt'}
        </motion.button>

        {isGenerating && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={cancelGeneration}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancel
          </motion.button>
        )}
      </div>

      {/* Generated Prompts Display */}
      <AnimatePresence>
        {generatedPrompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Generated Prompts ({generatedPrompts.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={savePrompt}
                  className="p-2 text-gray-300 hover:text-white"
                >
                  <BookmarkIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {/* Share functionality */}}
                  className="p-2 text-gray-300 hover:text-white"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Version Selector */}
            {generatedPrompts.length > 1 && (
              <div className="flex gap-2 mb-4">
                {generatedPrompts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVersion(index)}
                    className={`px-3 py-1 rounded ${
                      selectedVersion === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    V{index + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Prompt Display */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded p-4">
                <pre className="text-gray-100 whitespace-pre-wrap">
                  {generatedPrompts[selectedVersion].content}
                </pre>
              </div>

              {/* Quality Metrics */}
              <QualityMetrics
                metrics={generatedPrompts[selectedVersion].metadata.quality}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Library */}
      <PromptTemplates
        onSelect={(template) => setPrompt(template)}
        context={config.context}
      />

      {/* Output Formatting Options */}
      <OutputFormatting
        config={config.output}
        onChange={(updates) => updateConfig('output', updates)}
      />
    </div>
  );
};

export default EnhancedPromptGenerator;
