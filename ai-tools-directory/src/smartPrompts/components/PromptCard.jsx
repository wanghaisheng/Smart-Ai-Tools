import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ShareIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const PromptCard = ({ prompt, onRate, onShare, onEdit, onDelete, currentUser }) => {
  const isOwner = currentUser && prompt.creator._id === currentUser.id;
  
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

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-1">
          {renderStars()}
          <span className="text-sm text-gray-500 ml-2">
            ({prompt.stats.totalRatings} ratings)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onShare(prompt._id)}
            className="text-gray-400 hover:text-gray-500"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
          
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(prompt._id)}
                className="text-gray-400 hover:text-blue-500"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(prompt._id)}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PromptCard;
