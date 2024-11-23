import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  ShareIcon, 
  PencilIcon, 
  TrashIcon,
  HeartIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';

const PromptCard = ({ prompt, onRate, onShare, onEdit, onDelete, currentUser, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(prompt.likes?.includes(currentUser?.id));
  const [isSaved, setIsSaved] = useState(prompt.saves?.includes(currentUser?.id));
  const isOwner = currentUser && prompt.creator._id === currentUser.id;
  
  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Please login to like prompts');
      return;
    }
    try {
      await axios.post(`/api/smart-prompts/${prompt._id}/like`);
      setIsLiked(!isLiked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking prompt:', error);
      toast.error('Failed to like prompt');
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('Please login to save prompts');
      return;
    }
    try {
      await axios.post(`/api/smart-prompts/${prompt._id}/save`);
      setIsSaved(!isSaved);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const rating = Math.round(prompt.stats.averageRating);
      return (
        <button
          key={index}
          onClick={() => onRate(prompt._id, index + 1)}
          className="focus:outline-none"
        >
          {index < rating ? (
            <StarIconSolid className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarIcon className="h-5 w-5 text-gray-300 hover:text-yellow-400" />
          )}
        </button>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{prompt.title}</h3>
          <p className="text-sm text-gray-500">by {prompt.creator.username}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {prompt.category}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{prompt.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {renderStars()}
            <span className="ml-2 text-sm text-gray-500">
              ({prompt.stats.totalRatings})
            </span>
          </div>
          
          <button 
            onClick={handleLike}
            className="focus:outline-none"
          >
            {isLiked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
            )}
          </button>

          <button 
            onClick={handleSave}
            className="focus:outline-none"
          >
            {isSaved ? (
              <BookmarkIconSolid className="h-6 w-6 text-blue-500" />
            ) : (
              <BookmarkIcon className="h-6 w-6 text-gray-400 hover:text-blue-500" />
            )}
          </button>

          <button
            onClick={onShare}
            className="focus:outline-none"
          >
            <ShareIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="focus:outline-none"
            >
              <PencilIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
            <button
              onClick={onDelete}
              className="focus:outline-none"
            >
              <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PromptCard;
