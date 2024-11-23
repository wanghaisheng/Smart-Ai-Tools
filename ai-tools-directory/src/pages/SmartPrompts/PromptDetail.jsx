import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Avatar
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Share as ShareIcon,
  BookmarkBorder,
  Bookmark
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from '../../smartPrompts/components/social/CommentSection';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const PromptDetail = () => {
  const { promptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPromptDetails();
  }, [promptId]);

  const fetchPromptDetails = async () => {
    try {
      const response = await axios.get(`/api/smart-prompts/${promptId}`);
      setPrompt(response.data);
      if (user) {
        setLiked(response.data.likes.includes(user._id));
        setSaved(response.data.saves.includes(user._id));
      }
    } catch (error) {
      console.error('Error fetching prompt details:', error);
      toast.error('Failed to load prompt details');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like prompts');
      return;
    }

    try {
      await axios.post(`/api/smart-prompts/${promptId}/like`);
      setLiked(!liked);
      fetchPromptDetails();
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
      await axios.post(`/api/smart-prompts/${promptId}/save`);
      setSaved(!saved);
      fetchPromptDetails();
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

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!prompt) {
    return (
      <Container>
        <Typography variant="h6">Prompt not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={prompt.author.avatar}
            alt={prompt.author.name}
            sx={{ cursor: 'pointer', mr: 2 }}
            onClick={() => handleUserClick(prompt.author._id)}
          />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ cursor: 'pointer' }}
              onClick={() => handleUserClick(prompt.author._id)}
            >
              {prompt.author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          {prompt.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {prompt.description}
        </Typography>

        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {prompt.content}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleLike}>
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {prompt.likes.length}
          </Typography>

          <IconButton onClick={handleSave}>
            {saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {prompt.saves.length}
          </Typography>

          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 3 }} />

        <CommentSection promptId={promptId} />
      </Paper>
    </Container>
  );
};

export default PromptDetail;
