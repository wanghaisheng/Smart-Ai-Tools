import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

const PromptModal = ({ prompt, isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-900/75 flex items-center justify-center"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex min-h-screen items-center justify-center p-4 w-full"
      >
        <div 
          className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 shadow-xl relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white">{prompt.title}</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="mt-4 space-y-4">
            {/* Main Content */}
            <div className="bg-gray-900 rounded p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                {prompt.content}
              </pre>
            </div>
            
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
              <p className="text-gray-300">{prompt.description}</p>
            </div>
            
            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata for AI Generated Prompts */}
            {prompt.metadata && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Generation Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(prompt.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <span className="text-gray-500 capitalize">{key}:</span>
                      <span className="ml-2 text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default PromptModal;
