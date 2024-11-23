import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Box, Typography, Rating, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert, Reply, ThumbUp, ThumbDown } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Comment = ({ comment, onDelete, onReply, onVote, promptId }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    try {
      await onDelete(comment._id);
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await onReply(comment._id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar src={comment.user.avatar} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1">{comment.user.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
        
        {user && (user._id === comment.user._id || user.role === 'admin') && (
          <>
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <Rating value={comment.rating} readOnly sx={{ mb: 1 }} />
      <Typography variant="body1" sx={{ mb: 2 }}>{comment.content}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Button
          size="small"
          startIcon={<ThumbUp />}
          onClick={() => onVote(comment._id, 'up')}
          color={comment.userVote === 'up' ? 'primary' : 'inherit'}
        >
          {comment.upvotes || 0}
        </Button>
        <Button
          size="small"
          startIcon={<ThumbDown />}
          onClick={() => onVote(comment._id, 'down')}
          color={comment.userVote === 'down' ? 'primary' : 'inherit'}
        >
          {comment.downvotes || 0}
        </Button>
        <Button
          size="small"
          startIcon={<Reply />}
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          Reply
        </Button>
      </Box>

      {showReplyForm && (
        <Box sx={{ ml: 4, mt: 2 }}>
          <form onSubmit={handleReplySubmit}>
            <TextField
              fullWidth
              size="small"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => setShowReplyForm(false)}>
                Cancel
              </Button>
              <Button size="small" variant="contained" type="submit">
                Reply
              </Button>
            </Box>
          </form>
        </Box>
      )}

      {comment.replies?.map((reply) => (
        <Box key={reply._id} sx={{ ml: 4, mt: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={reply.user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
              <Typography variant="subtitle2">{reply.user.username}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
            <Typography variant="body2">{reply.content}</Typography>
          </Paper>
        </Box>
      ))}
    </Paper>
  );
};

const CommentSection = ({ promptId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [promptId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/smart-prompts/${promptId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/smart-prompts/${promptId}/comments`, {
        content: newComment,
        rating
      });
      
      setComments([response.data, ...comments]);
      setNewComment('');
      setRating(0);
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/smart-prompts/${promptId}/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      throw error;
    }
  };

  const handleReply = async (commentId, content) => {
    try {
      const response = await axios.post(`/api/smart-prompts/${promptId}/comments/${commentId}/replies`, {
        content
      });
      
      setComments(comments.map(c => 
        c._id === commentId 
          ? { ...c, replies: [...(c.replies || []), response.data] }
          : c
      ));
      toast.success('Reply posted successfully');
    } catch (error) {
      throw error;
    }
  };

  const handleVote = async (commentId, voteType) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    try {
      const response = await axios.post(`/api/smart-prompts/${promptId}/comments/${commentId}/vote`, {
        voteType
      });
      
      setComments(comments.map(c => 
        c._id === commentId 
          ? { ...c, ...response.data }
          : c
      ));
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to register vote');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Comments & Ratings
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmitComment}>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Share your thoughts..." : "Please login to comment"}
            disabled={!user || loading}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            type="submit"
            disabled={!user || loading || !newComment.trim()}
          >
            Post Comment
          </Button>
        </form>
      </Paper>

      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onDelete={handleDeleteComment}
          onReply={handleReply}
          onVote={handleVote}
          promptId={promptId}
        />
      ))}
    </Box>
  );
};

export default CommentSection;
