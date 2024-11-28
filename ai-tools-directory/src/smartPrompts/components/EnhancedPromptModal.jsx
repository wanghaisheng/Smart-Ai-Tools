import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  StarIcon,
  ArrowDownTrayIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const EnhancedPromptModal = ({ 
  prompt, 
  isOpen, 
  onClose, 
  onLike, 
  onSave, 
  onRate,
  onComment,
  onShare,
  onDownload,
  currentUser,
  isLoading,
  error 
}) => {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(prompt?.rating || 0);
  const [isLiked, setIsLiked] = useState(prompt?.isLiked || false);
  const [isSaved, setIsSaved] = useState(prompt?.isSaved || false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (prompt) {
      setRating(prompt.rating || 0);
      setIsLiked(prompt.isLiked || false);
      setIsSaved(prompt.isSaved || false);
    }
  }, [prompt]);

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
    element.download = `${prompt.title.toLowerCase().replace(/\\s+/g, '-')}.txt`;
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
    if (!currentUser) {
      toast.error('Please login to like prompts');
      return;
    }
    if (onLike) {
      onLike();
      setIsLiked(!isLiked);
    }
  };

  const handleSave = () => {
    if (!currentUser) {
      toast.error('Please login to save prompts');
      return;
    }
    if (onSave) {
      onSave();
      setIsSaved(!isSaved);
    }
  };

  const handleRate = (value) => {
    if (!currentUser) {
      toast.error('Please login to rate prompts');
      return;
    }
    if (onRate) {
      onRate(value);
      setRating(value);
    }
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );

  if (!isOpen || !prompt) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-900/75 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-2xl relative mx-4 my-8"
          onClick={e => e.stopPropagation()}
        >
          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} />}
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-gray-700">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">{prompt.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <UserCircleIcon className="w-4 h-4" />
                  {prompt.creator?.username || 'Anonymous'}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Main Content with Copy Button */}
            <div className="relative">
              <div className="bg-gray-900 rounded-xl p-6 pr-16 font-mono">
                <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {prompt.content}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <ClipboardDocumentIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
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
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
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
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-gray-200 ml-2">{prompt.metadata.model}</span>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-gray-200 ml-2">{prompt.metadata.type}</span>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-400">Tone:</span>
                    <span className="text-gray-200 ml-2">{prompt.metadata.tone}</span>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-400">Length:</span>
                    <span className="text-gray-200 ml-2">{prompt.metadata.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={isLoading}
                  className={`flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLiked ? (
                    <HeartIconSolid className="w-6 h-6 text-pink-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6" />
                  )}
                  <span>{prompt.likes?.length || 0}</span>
                </button>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaved ? (
                    <BookmarkIconSolid className="w-6 h-6 text-blue-500" />
                  ) : (
                    <BookmarkIcon className="w-6 h-6" />
                  )}
                  <span>{prompt.saves?.length || 0}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => setShowComments(!showComments)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChatBubbleLeftIcon className="w-6 h-6" />
                  <span>{prompt.comments?.length || 0}</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      disabled={isLoading}
                      className={`p-1 transition-colors ${
                        star <= rating
                          ? 'text-yellow-400'
                          : 'text-gray-600 hover:text-yellow-400'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {star <= rating ? (
                        <StarIconSolid className="w-5 h-5" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className={`p-2 text-gray-400 hover:text-gray-300 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Download Prompt"
                >
                  <ArrowDownTrayIcon className="w-6 h-6" />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  disabled={isLoading}
                  className={`p-2 text-gray-400 hover:text-gray-300 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Share Prompt"
                >
                  <ShareIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-gray-700 p-6">
              <h4 className="text-lg font-medium text-white mb-4">Comments</h4>
              {/* Add your comments component here */}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default EnhancedPromptModal;
