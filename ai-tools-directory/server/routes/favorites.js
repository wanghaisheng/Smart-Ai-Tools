import express from 'express';
import Tool from '../models/Tool.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Toggle favorite status of a tool
router.post('/toggle/:toolId', authenticate, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    const userIndex = tool.favoritedBy.indexOf(req.userId);
    if (userIndex === -1) {
      // Add to favorites
      tool.favoritedBy.push(req.userId);
      tool.favoriteCount += 1;
    } else {
      // Remove from favorites
      tool.favoritedBy.splice(userIndex, 1);
      tool.favoriteCount = Math.max(0, tool.favoriteCount - 1);
    }

    await tool.save();
    res.json({ 
      isFavorited: userIndex === -1,
      favoriteCount: tool.favoriteCount 
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Error toggling favorite status' });
  }
});

// Get user's favorite tools
router.get('/my', authenticate, async (req, res) => {
  try {
    const tools = await Tool.find({
      favoritedBy: req.userId,
      status: 'approved'
    }).sort('-createdAt');
    res.json(tools);
  } catch (error) {
    console.error('Error fetching favorite tools:', error);
    res.status(500).json({ message: 'Error fetching favorite tools' });
  }
});

// Check if a tool is favorited by the user
router.get('/check/:toolId', authenticate, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    res.json({
      isFavorited: tool.favoritedBy.includes(req.userId),
      favoriteCount: tool.favoriteCount
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Error checking favorite status' });
  }
});

export default router;
