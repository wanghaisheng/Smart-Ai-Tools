import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ClipboardDocumentIcon, 
  HeartIcon, 
  ShareIcon, 
  StarIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

const PromptModal = ({ prompt, isOpen, onClose, onLike, onSave, onRate }) => {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(prompt.rating || 0);
  const [isLiked, setIsLiked] = useState(prompt.isLiked || false);
  const [isSaved, setIsSaved] = useState(prompt.isSaved || false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([prompt.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${prompt.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Prompt downloaded!');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: prompt.title,
          text: prompt.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share prompt');
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike();
      setIsLiked(!isLiked);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      setIsSaved(!isSaved);
    }
  };

  const handleRate = (value) => {
    if (onRate) {
      onRate(value);
      setRating(value);
    }
  };

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
          className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">{prompt.title}</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Main Content with Copy Button */}
            <div className="relative">
              <div className="bg-gray-900 rounded-lg p-4 pr-12">
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                  {prompt.content}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <ClipboardDocumentIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
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

          {/* Footer with Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            {/* Left side - Rating */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="focus:outline-none"
                >
                  {star <= rating ? (
                    <StarIconSolid className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                title="Like"
              >
                {isLiked ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                )}
              </button>

              <button
                onClick={handleSave}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                title="Save"
              >
                {isSaved ? (
                  <BookmarkIconSolid className="w-5 h-5 text-blue-500" />
                ) : (
                  <BookmarkIcon className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                )}
              </button>

              <button
                onClick={handleDownload}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                title="Download"
              >
                <ArrowDownTrayIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                title="Share"
              >
                <ShareIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default PromptModal;
