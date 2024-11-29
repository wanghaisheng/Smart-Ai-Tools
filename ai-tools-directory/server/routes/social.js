import express from 'express';
import { authenticate } from '../middleware/auth.js';
import SocialProfile from '../models/SocialProfile.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.params.userId })
      .populate('user', 'username email')
      .populate('followers', 'username')
      .populate('following', 'username');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    let profile = await SocialProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      profile = new SocialProfile({
        user: req.user.id,
        ...req.body
      });
    } else {
      Object.assign(profile, req.body);
    }
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Follow user
router.post('/follow/:userId', authenticate, async (req, res) => {
  try {
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await SocialProfile.findOne({ user: req.user.id });
    const targetProfile = await SocialProfile.findOne({ user: req.params.userId });

    if (!profile.following.includes(req.params.userId)) {
      profile.following.push(req.params.userId);
      targetProfile.followers.push(req.user.id);

      await profile.save();
      await targetProfile.save();
    }

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unfollow user
router.post('/unfollow/:userId', authenticate, async (req, res) => {
  try {
    const profile = await SocialProfile.findOne({ user: req.user.id });
    const targetProfile = await SocialProfile.findOne({ user: req.params.userId });

    profile.following = profile.following.filter(id => id.toString() !== req.params.userId);
    targetProfile.followers = targetProfile.followers.filter(id => id.toString() !== req.user.id);

    await profile.save();
    await targetProfile.save();

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to prompt
router.post('/prompts/:promptId/comments', authenticate, async (req, res) => {
  try {
    const comment = new Comment({
      prompt: req.params.promptId,
      user: req.user.id,
      content: req.body.content,
      rating: req.body.rating
    });

    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get comments for a prompt
router.get('/prompts/:promptId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ prompt: req.params.promptId })
      .populate('user', 'username')
      .populate('replies.user', 'username')
      .sort('-createdAt');
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add reply to comment
router.post('/comments/:commentId/replies', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    comment.replies.push({
      user: req.user.id,
      content: req.body.content
    });
    
    await comment.save();
    
    const updatedComment = await Comment.findById(req.params.commentId)
      .populate('user', 'username')
      .populate('replies.user', 'username');
    
    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/unlike comment
router.post('/comments/:commentId/like', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    const likeIndex = comment.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      comment.likes.push(req.user.id);
    } else {
      comment.likes.splice(likeIndex, 1);
    }
    
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
