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
      transition: { duration: 0.4, ease: "easeOut" }
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
      variants={cardVariants}
      onClick={onClick}
      className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          {/* Title and Creator */}
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {prompt.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {prompt.description}
          </p>

          {/* Stats and Info */}
          <div className="mt-2 flex items-start space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div className="text-sm text-blue-600 space-y-1">
              <p>Created by {prompt.creator.username}</p>
              <p>{prompt.stats.uses} uses • {prompt.stats.totalRatings} ratings</p>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          <div className="flex items-center space-x-2">
            {/* Like Button with Counter */}
            <div className="flex items-center bg-white rounded-full px-2 py-1 hover:bg-gray-50 transition-colors">
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {isLiked ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-400" />
                )}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: isLiked ? 1 : 0 }}
                  className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
                />
              </motion.button>
              <span className="ml-1.5 text-sm font-medium text-gray-600">{likesCount}</span>
            </div>

            {/* Save Button with Counter */}
            <div className="flex items-center bg-white rounded-full px-2 py-1 hover:bg-gray-50 transition-colors">
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {isSaved ? (
                  <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
                ) : (
                  <BookmarkIcon className="h-5 w-5 text-gray-400" />
                )}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: isSaved ? 1 : 0 }}
                  className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"
                />
              </motion.button>
              <span className="ml-1.5 text-sm font-medium text-gray-600">{savesCount}</span>
            </div>
          </div>

          <div className="flex items-center text-blue-500 hover:text-blue-600">
            <span className="text-sm mr-1">View</span>
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Tags and Category */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full flex items-center">
          <SparklesIcon className="h-3.5 w-3.5 mr-1" />
          {prompt.category}
        </span>
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full flex items-center"
          >
            <HashtagIcon className="h-3.5 w-3.5 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      {/* AI Models */}
      {prompt.aiModels && prompt.aiModels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {prompt.aiModels.map((model) => (
            <span
              key={model}
              className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full flex items-center"
            >
              <SparklesIconSolid className="h-3.5 w-3.5 mr-1" />
              {model}
            </span>
          ))}
        </div>
      )}

      {/* Admin Actions */}
      {isOwner && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-full hover:bg-gray-50"
          >
            <PencilSquareIcon className="h-5 w-5 text-gray-400 hover:text-green-500" />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt._id);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-full hover:bg-gray-50"
          >
            <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default PromptCard;
