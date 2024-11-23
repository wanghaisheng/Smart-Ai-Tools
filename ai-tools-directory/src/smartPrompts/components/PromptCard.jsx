import React, { useState, useEffect } from 'react';
import PromptModal from './PromptModal';
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
  InformationCircleIcon,
  CalendarDaysIcon
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
  const [showModal, setShowModal] = useState(false);

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

  const handleCardClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
    if (onClick) onClick();
  };



  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onClick={handleCardClick}
      className="border border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-800 relative overflow-hidden group"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          {/* Title and Metadata */}
          <div className="flex-1">
            <motion.h3 
              variants={contentVariants}
              className="font-semibold text-xl text-gray-100 mb-3 group-hover:text-blue-400 transition-colors duration-300"
            >
              {prompt.title}
            </motion.h3>

            <motion.div 
              variants={contentVariants}
              className="flex flex-wrap gap-2 items-center"
            >
              {/* Category Badge */}
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full flex items-center">
                <SparklesIcon className="h-3.5 w-3.5 mr-1.5" />
                {prompt.category}
              </span>

              {/* Creator Info */}
              <span className="flex items-center text-gray-400 text-sm">
                <UserCircleIcon className="h-4 w-4 mr-1.5" />
                {prompt.creator.username}
              </span>

              {/* Date */}
              <span className="flex items-center text-gray-500 text-sm">
                <CalendarDaysIcon className="h-4 w-4 mr-1.5" />
                {new Date(prompt.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            variants={contentVariants}
            className="flex items-center gap-2 ml-4"
          >
            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              {isLiked ? (
                <HeartIconSolid className="h-4 w-4 text-red-500" />
              ) : (
                <HeartIcon className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-300">{likesCount}</span>
            </motion.button>

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              {isSaved ? (
                <BookmarkIconSolid className="h-4 w-4 text-blue-500" />
              ) : (
                <BookmarkIcon className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-300">{savesCount}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Description */}
        <motion.p 
          variants={contentVariants}
          className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300"
        >
          {prompt.description}
        </motion.p>

        {/* Stats Row */}
        <motion.div 
          variants={contentVariants}
          className="flex items-center justify-between pt-4 border-t border-gray-700"
        >
          {/* Stats */}
          <div className="flex items-center gap-4">
            <span className="flex items-center text-gray-400 text-sm">
              <SparklesIconSolid className="h-4 w-4 mr-1.5 text-purple-400" />
              {prompt.stats.uses} uses
            </span>
            <span className="flex items-center text-gray-400 text-sm">
              <StarIcon className="h-4 w-4 mr-1.5 text-yellow-400" />
              {prompt.stats.totalRatings} ratings
            </span>
          </div>

          {/* View Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <span className="text-sm">View</span>
            <ArrowRightIcon className="h-4 w-4" />
          </motion.button>
        </motion.div>

        {/* Tags and Models */}
        <motion.div 
          variants={contentVariants}
          className="flex flex-wrap gap-2"
        >
          {/* Tags */}
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full flex items-center hover:bg-gray-700 transition-colors"
            >
              <HashtagIcon className="h-3.5 w-3.5 mr-1.5" />
              {tag}
            </span>
          ))}
          
          {/* AI Models */}
          {prompt.aiModels?.map((model) => (
            <span
              key={model}
              className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full flex items-center hover:bg-purple-500/20 transition-colors"
            >
              <SparklesIconSolid className="h-3.5 w-3.5 mr-1.5" />
              {model}
            </span>
          ))}
        </motion.div>

        {/* Admin Actions */}
        {isOwner && (
          <motion.div 
            variants={contentVariants}
            className="flex justify-end gap-2 pt-4 border-t border-gray-700"
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
      </div>



      {/* Modal */}
      <PromptModal 
  prompt={prompt}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
/>
    </motion.div>
  );
}

      

export default PromptCard;