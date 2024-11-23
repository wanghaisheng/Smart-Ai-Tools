import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  ArrowRightIcon,
  PencilSquareIcon,
  TrashIcon,
  HeartIcon,
  BookmarkIcon,
  UserCircleIcon,
  SparklesIcon,
  HashtagIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const PromptCard = ({ prompt, onRate, onShare, onEdit, onDelete, onUpdate, onClick }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(prompt.likes?.length || 0);
  const [savesCount, setSavesCount] = useState(prompt.saves?.length || 0);
  const isOwner = user && prompt.creator._id === user.id;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Update like/save states when prompt or user changes
  useEffect(() => {
    if (user && prompt) {
      setIsLiked(prompt.likes?.includes(user.id));
      setIsSaved(prompt.saves?.includes(user.id));
      setLikesCount(prompt.likes?.length || 0);
      setSavesCount(prompt.saves?.length || 0);
    }
  }, [prompt, user]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to like prompts');
      return;
    }
    try {
      const response = await api.post(`/smart-prompts/${prompt._id}/like`, {});
      const { likes, isLiked: newIsLiked } = response.data;
      setIsLiked(newIsLiked);
      setLikesCount(likes);
      if (onUpdate) onUpdate(prompt._id);
    } catch (error) {
      console.error('Error liking prompt:', error);
      toast.error('Failed to like prompt');
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save prompts');
      return;
    }
    try {
      const response = await api.post(`/smart-prompts/${prompt._id}/save`, {});
      const { saves, isSaved: newIsSaved } = response.data;
      setIsSaved(newIsSaved);
      setSavesCount(saves);
      if (onUpdate) onUpdate(prompt._id);
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onClick={onClick}
      className="border border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-800 relative overflow-hidden group"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <motion.div 
          className="flex-grow"
          variants={contentVariants}
        >
          {/* Title and Creator */}
          <h3 className="font-semibold text-lg text-gray-100 mb-1 group-hover:text-blue-400 transition-colors duration-300">
            {prompt.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-2 group-hover:text-gray-300 transition-colors duration-300">
            {prompt.description}
          </p>

          {/* Stats and Info */}
          <div className="mt-2 flex items-start space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
            <div className="text-sm text-gray-300 space-y-1">
              <p>Created by <span className="text-blue-400">{prompt.creator.username}</span></p>
              <p className="text-gray-400">{prompt.stats.uses} uses • {prompt.stats.totalRatings} ratings</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side Actions */}
        <motion.div 
          className="flex flex-col items-end space-y-2 ml-4"
          variants={contentVariants}
        >
          <div className="flex items-center space-x-2">
            {/* Like Button with Counter */}
            <motion.div 
              className="flex items-center bg-gray-700/50 rounded-full px-3 py-1.5 hover:bg-gray-700 transition-colors group/like"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                onClick={handleLike}
                className="relative"
              >
                {isLiked ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-400 group-hover/like:text-red-400" />
                )}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: isLiked ? 1 : 0 }}
                  className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-gray-800"
                />
              </motion.button>
              <span className="ml-2 text-sm font-medium text-gray-300 group-hover/like:text-gray-100">{likesCount}</span>
            </motion.div>

            {/* Save Button with Counter */}
            <motion.div 
              className="flex items-center bg-gray-700/50 rounded-full px-3 py-1.5 hover:bg-gray-700 transition-colors group/save"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                onClick={handleSave}
                className="relative"
              >
                {isSaved ? (
                  <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
                ) : (
                  <BookmarkIcon className="h-5 w-5 text-gray-400 group-hover/save:text-blue-400" />
                )}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: isSaved ? 1 : 0 }}
                  className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-gray-800"
                />
              </motion.button>
              <span className="ml-2 text-sm font-medium text-gray-300 group-hover/save:text-gray-100">{savesCount}</span>
            </motion.div>
          </div>

          <motion.div 
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            whileHover={{ x: 3 }}
          >
            <span className="text-sm mr-1">View</span>
            <ArrowRightIcon className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Tags and Category */}
      <motion.div 
        className="mt-4 flex flex-wrap gap-2"
        variants={contentVariants}
      >
        <motion.span 
          className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full flex items-center hover:bg-blue-500/20 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          <SparklesIcon className="h-3.5 w-3.5 mr-1" />
          {prompt.category}
        </motion.span>
        {prompt.tags.map((tag) => (
          <motion.span
            key={tag}
            className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full flex items-center hover:bg-gray-700 hover:text-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <HashtagIcon className="h-3.5 w-3.5 mr-1" />
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* AI Models */}
      {prompt.aiModels && prompt.aiModels.length > 0 && (
        <motion.div 
          className="mt-3 flex flex-wrap gap-2"
          variants={contentVariants}
        >
          {prompt.aiModels.map((model) => (
            <motion.span
              key={model}
              className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full flex items-center hover:bg-purple-500/20 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIconSolid className="h-3.5 w-3.5 mr-1" />
              {model}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Admin Actions */}
      {isOwner && (
        <motion.div 
          className="mt-4 pt-3 border-t border-gray-700 flex justify-end space-x-2"
          variants={contentVariants}
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
            whileHover={{ scale: 1.1, color: '#10B981' }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            <PencilSquareIcon className="h-5 w-5 text-gray-400" />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt._id);
            }}
            whileHover={{ scale: 1.1, color: '#EF4444' }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            <TrashIcon className="h-5 w-5 text-gray-400" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PromptCard;
