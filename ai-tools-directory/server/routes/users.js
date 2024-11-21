import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's favorite tools
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('favorites');
    
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add tool to favorites
router.post('/favorites/:toolId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const toolId = req.params.toolId;
    
    if (!user.favorites.includes(toolId)) {
      user.favorites.push(toolId);
      await user.save();
    }
    
    const populatedUser = await User.findById(req.userId)
      .populate('favorites');
    
    res.json(populatedUser.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove tool from favorites
router.delete('/favorites/:toolId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const toolId = req.params.toolId;
    
    user.favorites = user.favorites.filter(
      favorite => favorite.toString() !== toolId
    );
    
    await user.save();
    
    const populatedUser = await User.findById(req.userId)
      .populate('favorites');
    
    res.json(populatedUser.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's basic info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
