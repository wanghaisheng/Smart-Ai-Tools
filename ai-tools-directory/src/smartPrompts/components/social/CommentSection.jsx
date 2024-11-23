import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Box, Typography, Rating, Paper } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ promptId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchComments();
  }, [promptId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/smart-prompts/${promptId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/smart-prompts/${promptId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          rating: rating,
        }),
      });
      if (response.ok) {
        setNewComment('');
        setRating(0);
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
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
            placeholder="Share your thoughts..."
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit">
            Post Comment
          </Button>
        </form>
      </Paper>

      {comments.map((comment) => (
        <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={comment.user.avatar} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle1">{comment.user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
          <Rating value={comment.rating} readOnly sx={{ mb: 1 }} />
          <Typography variant="body1">{comment.content}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default CommentSection;
