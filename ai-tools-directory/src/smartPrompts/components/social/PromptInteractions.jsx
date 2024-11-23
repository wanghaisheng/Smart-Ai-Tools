import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Divider } from '@mui/material';
import { 
  FavoriteBorder, 
  Favorite, 
  BookmarkBorder, 
  Bookmark, 
  Share as ShareIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

const PromptInteractions = ({ promptId, initialLikes = 0, initialSaves = 0, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [saves, setSaves] = useState(initialSaves);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserInteractions();
    }
  }, [user, promptId]);

  const checkUserInteractions = async () => {
    try {
      const response = await axios.get(`/api/smart-prompts/${promptId}/interactions`);
      setIsLiked(response.data.isLiked);
      setIsSaved(response.data.isSaved);
      setLikes(response.data.likes);
      setSaves(response.data.saves);
    } catch (error) {
      console.error('Error checking interactions:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like prompts');
      return;
    }

    try {
      const response = await axios.post(`/api/smart-prompts/${promptId}/like`);
      setIsLiked(!isLiked);
      setLikes(response.data.likes);
      if (onUpdate) onUpdate();
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
      const response = await axios.post(`/api/smart-prompts/${promptId}/save`);
      setIsSaved(!isSaved);
      setSaves(response.data.saves);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch (error) {
      console.error('Error sharing prompt:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2">{likes}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleSave} color={isSaved ? 'primary' : 'default'}>
            {isSaved ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
          <Typography variant="body2">{saves}</Typography>
        </Box>

        <IconButton onClick={handleShare}>
          <ShareIcon />
        </IconButton>

        <IconButton onClick={() => setShowComments(!showComments)}>
          <ChatIcon />
        </IconButton>
      </Box>

      {showComments && (
        <>
          <Divider sx={{ my: 2 }} />
          <CommentSection promptId={promptId} />
        </>
      )}
    </Box>
  );
};

export default PromptInteractions;
