import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const AiPromptGenerator = ({ onSavePrompt }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);

  const generatePrompt = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with your AI service
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setGeneratedPrompt(data.prompt);
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
      tags: ['ai-generated', topic.toLowerCase()],
      visibility: 'private'
    });
    
    setGeneratedPrompt(null);
    setTopic('');
    toast.success('Prompt saved successfully!');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Enter Topic or Description
        </label>
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
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Generated Prompt:</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{generatedPrompt}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Save Prompt
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AiPromptGenerator;
