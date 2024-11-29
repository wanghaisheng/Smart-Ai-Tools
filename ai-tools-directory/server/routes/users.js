import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Tool from '../models/Tool.js';
import Review from '../models/Review.js';
import Collection from '../models/Collection.js';

const router = express.Router();

// Get user's dashboard stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const [favorites, reviews, submitted, collections] = await Promise.all([
      Tool.countDocuments({ favoritedBy: req.user.id }),
      Review.countDocuments({ user: req.user.id }),
      Tool.countDocuments({ submittedBy: req.user.id }),
      Collection.countDocuments({ user: req.user.id })
    ]);

    res.json({
      favorites,
      reviews,
      submitted,
      collections
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

// Get user's recent activity
router.get('/activity', authenticate, async (req, res) => {
  try {
    const [favoriteActivity, reviewActivity, submittedActivity] = await Promise.all([
      Tool.find({ favoritedBy: req.user.id })
        .sort('-updatedAt')
        .limit(5)
        .select('name updatedAt'),
      Review.find({ user: req.user.id })
        .sort('-createdAt')
        .limit(5)
        .populate('tool', 'name'),
      Tool.find({ submittedBy: req.user.id })
        .sort('-createdAt')
        .limit(5)
        .select('name createdAt status')
    ]);

    const activity = [
      ...favoriteActivity.map(item => ({
        _id: item._id,
        type: 'favorite',
        description: `Favorited ${item.name}`,
        createdAt: item.updatedAt
      })),
      ...reviewActivity.map(item => ({
        _id: item._id,
        type: 'review',
        description: `Reviewed ${item.tool.name}`,
        createdAt: item.createdAt
      })),
      ...submittedActivity.map(item => ({
        _id: item._id,
        type: 'submit',
        description: `Submitted ${item.name} (${item.status})`,
        createdAt: item.createdAt
      }))
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

    res.json(activity);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Error fetching user activity' });
  }
});

// Get user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { username, email, bio, avatar } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Get user's favorite tools
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const tools = await Tool.find({
      favoritedBy: req.user.id,
      status: 'approved'
    }).sort('-createdAt');
    res.json(tools);
  } catch (error) {
    console.error('Error fetching favorite tools:', error);
    res.status(500).json({ message: 'Error fetching favorite tools' });
  }
});

// Get user's collections
router.get('/collections', authenticate, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id })
      .populate('tools')
      .sort({ updatedAt: -1 });
    
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Error fetching user collections' });
  }
});

export default router;
