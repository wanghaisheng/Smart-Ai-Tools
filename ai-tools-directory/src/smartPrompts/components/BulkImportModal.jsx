import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { promptService } from '../services/promptService';
import toast from 'react-hot-toast';

// Valid categories
const VALID_CATEGORIES = [
  'Technology',
  'Health and Wellness',
  'Finance',
  'Education',
  'Entertainment',
  'Travel',
  'Food and Cooking',
  'Fashion and Beauty',
  'Sports',
  'Science',
  'Environment',
  'Personal Development',
  'Business and Entrepreneurship',
  'Marketing',
  'Artificial Intelligence',
  'Social Media',
  'Gaming',
  'Politics',
  'Relationships',
  'Parenting',
  'Real Estate',
  'Automotive',
  'Music',
  'Art and Design',
  'Lifestyle',
  'News and Current Events',
  'Cryptocurrency',
  'Mental Health',
  'Career Advice',
  'DIY and Crafts',
  'Fitness',
  'History',
  'Photography',
  'Animals and Pets',
  'Spirituality and Religion',
  'Movies and TV Shows',
  'Language Learning',
  'Gardening',
  'Space and Astronomy',
  'Legal Advice',
  'Cultural Diversity',
  'Human Rights',
  'Philosophy',
  'Economics',
  'Environmental Sustainability',
  'Biotechnology',
  'Robotics',
  'Data Science',
  'Cybersecurity',
  'Virtual Reality and Augmented Reality'
];

// Category mapping for validation
const CATEGORY_MAPPING = {
  'Content Writing': 'Marketing',
  'Technical Documentation': 'Technology',
  'Business Writing': 'Business and Entrepreneurship',
  'Creative Writing': 'Art and Design',
  'Educational Content': 'Education',
  'Content Creation': 'Marketing',
  'Technical': 'Technology',
  'Business': 'Business and Entrepreneurship',
  'Creative': 'Art and Design',
  'Other': 'Technology'  // Default mapping for legacy 'Other' category
};

const BulkImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importStats, setImportStats] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid JSON file');
    }
  };

  const validatePrompts = (prompts) => {
    if (!Array.isArray(prompts)) {
      throw new Error('Invalid format: Expected an array of prompts');
    }

    const requiredFields = ['title', 'content', 'description', 'category'];
    const errors = [];

    prompts.forEach((prompt, index) => {
      requiredFields.forEach(field => {
        if (!prompt[field]) {
          errors.push(`Prompt at index ${index} is missing required field: ${field}`);
        }
      });

      // Validate category
      const mappedCategory = CATEGORY_MAPPING[prompt.category] || prompt.category;
      if (!VALID_CATEGORIES.includes(mappedCategory)) {
        errors.push(`Prompt at index ${index} has invalid category: ${prompt.category}. Valid categories are: ${VALID_CATEGORIES.join(', ')}`);
      }

      // Validate variables if present
      if (prompt.variables) {
        if (!Array.isArray(prompt.variables)) {
          errors.push(`Prompt at index ${index} has invalid variables format`);
        } else {
          prompt.variables.forEach((variable, varIndex) => {
            if (!variable.name || !variable.description) {
              errors.push(`Prompt at index ${index}, variable at index ${varIndex} is missing required fields`);
            }
          });
        }
      }
    });

    if (errors.length > 0) {
      throw new Error(`Validation errors:\n${errors.join('\n')}`);
    }

    return true;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target.result);
          const prompts = content.prompts || content;

          // Validate prompts
          validatePrompts(prompts);

          // Perform bulk import
          const result = await promptService.bulkImportPrompts({ prompts });
          
          setImportStats({
            total: result.results.total,
            successful: result.results.successful,
            failed: result.results.failed
          });

          if (result.results.successful > 0) {
            toast.success(`Successfully imported ${result.results.successful} prompts!`);
            
            // Trigger refresh of prompts list
            if (onSuccess) {
              onSuccess(result);
            }

            // Close modal and refresh page after short delay
            setTimeout(() => {
              onClose();
              window.location.reload(); // Refresh to show new prompts
            }, 2000);
          }
          
          if (result.results.failed > 0) {
            toast.error(`Failed to import ${result.results.failed} prompts`);
          }

        } catch (error) {
          console.error('Error processing file:', error);
          toast.error(error.message || 'Error processing file');
        } finally {
          setLoading(false);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing prompts:', error);
      toast.error('Failed to import prompts');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Import Prompts</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!importStats ? (
            <>
              {/* File Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label 
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ArrowUpTrayIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JSON file containing prompts</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".json"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <div className="flex items-center justify-between bg-gray-700/50 px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-300">{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Import Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleImport}
                  disabled={!file || loading}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    !file || loading
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {loading ? 'Importing...' : 'Import Prompts'}
                </button>
              </div>
            </>
          ) : (
            // Success State
            <div className="text-center py-6">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-white mb-2">Import Complete!</h4>
              <p className="text-gray-400 mb-6">
                Successfully imported {importStats.successful} out of {importStats.total} prompts
                {importStats.failed > 0 && ` (${importStats.failed} failed)`}
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={async () => {
                    try {
                      const result = await promptService.updatePromptsVisibility();
                      toast.success(`Updated visibility for ${result.modifiedCount} prompts`);
                      setTimeout(() => window.location.reload(), 1500);
                    } catch (error) {
                      toast.error('Failed to update prompt visibility');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Make All Prompts Public
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BulkImportModal;
