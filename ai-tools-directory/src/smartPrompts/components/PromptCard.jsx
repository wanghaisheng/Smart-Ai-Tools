import React, { useState, useEffect } from 'react';
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
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const PromptCard = ({ prompt, onRate, onShare, onEdit, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(prompt.likes?.length || 0);
  const [savesCount, setSavesCount] = useState(prompt.saves?.length || 0);
  const isOwner = user && prompt.creator._id === user.id;

  // Update like/save states when prompt or user changes
  useEffect(() => {
    if (user && prompt) {
      setIsLiked(prompt.likes?.includes(user.id));
      setIsSaved(prompt.saves?.includes(user.id));
      setLikesCount(prompt.likes?.length || 0);
      setSavesCount(prompt.saves?.length || 0);
    }
  }, [prompt, user]);
  
  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like prompts');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/smart-prompts/${prompt._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Like response:', response.data);
      
      const { likes, isLiked: newIsLiked } = response.data;
      setIsLiked(newIsLiked);
      setLikesCount(likes);
      
      // Force a refresh of the prompt data
      if (onUpdate) {
        console.log('Calling onUpdate after like');
        onUpdate(prompt._id);
      }
    } catch (error) {
      console.error('Error liking prompt:', error);
      toast.error('Failed to like prompt');
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please login to save prompts');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/smart-prompts/${prompt._id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Save response:', response.data);
      
      const { saves, isSaved: newIsSaved } = response.data;
      setIsSaved(newIsSaved);
      setSavesCount(saves);
      
      // Force a refresh of the prompt data
      if (onUpdate) {
        console.log('Calling onUpdate after save');
        onUpdate(prompt._id);
      }
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
          onClick={() => {
            if (!user) {
              toast.error('Please login to rate prompts');
              return;
            }
            onRate(prompt._id, index + 1);
          }}
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
      className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-grow truncate mr-2">
            {prompt.title}
          </h3>
          <div className="flex items-center space-x-2">
            {/* Like Button with Counter */}
            <div className="flex items-center">
              <button
                onClick={handleLike}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title={isLiked ? "Unlike" : "Like"}
              >
                {isLiked ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-500 hover:text-red-500" />
                )}
              </button>
              <span className="ml-1 text-sm text-gray-600">{likesCount}</span>
            </div>

            {/* Save Button with Counter */}
            <div className="flex items-center">
              <button
                onClick={handleSave}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title={isSaved ? "Unsave" : "Save"}
              >
                {isSaved ? (
                  <BookmarkIconSolid className="h-6 w-6 text-blue-500" />
                ) : (
                  <BookmarkIcon className="h-6 w-6 text-gray-500 hover:text-blue-500" />
                )}
              </button>
              <span className="ml-1 text-sm text-gray-600">{savesCount}</span>
            </div>

            {/* Share Button */}
            <button
              onClick={() => onShare(prompt._id)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Share"
            >
              <ShareIcon className="h-6 w-6 text-gray-500 hover:text-indigo-500" />
            </button>

            {/* Edit and Delete buttons for owner */}
            {isOwner && (
              <>
                <button
                  onClick={() => onEdit(prompt)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Edit"
                >
                  <PencilIcon className="h-6 w-6 text-gray-500 hover:text-green-500" />
                </button>
                <button
                  onClick={() => onDelete(prompt._id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Delete"
                >
                  <TrashIcon className="h-6 w-6 text-gray-500 hover:text-red-500" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-600">{prompt.description}</p>

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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptCard;
