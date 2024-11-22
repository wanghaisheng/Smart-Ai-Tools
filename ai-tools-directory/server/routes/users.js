import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import Tool from '../models/Tool.js';
import Review from '../models/Review.js';
import Collection from '../models/Collection.js';

const router = express.Router();

// Get user's dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [favorites, reviews, submitted, collections] = await Promise.all([
      Tool.countDocuments({ favoritedBy: req.userId }),
      Review.countDocuments({ user: req.userId }),
      Tool.countDocuments({ submittedBy: req.userId }),
      Collection.countDocuments({ user: req.userId })
    ]);

    res.json({
      favorites,
      reviews,
      submitted,
      collections
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
});

// Get user's recent activity
router.get('/activity', auth, async (req, res) => {
  try {
    const [favoriteActivity, reviewActivity, submittedActivity] = await Promise.all([
      Tool.find({ favoritedBy: req.userId })
        .sort('-updatedAt')
        .limit(5)
        .select('name updatedAt'),
      Review.find({ user: req.userId })
        .sort('-createdAt')
        .limit(5)
        .populate('tool', 'name'),
      Tool.find({ submittedBy: req.userId })
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
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password');
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
router.put('/me', auth, async (req, res) => {
  try {
    const { username, email, bio, avatar } = req.body;
    const user = await User.findById(req.userId);
    
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
router.get('/favorites', auth, async (req, res) => {
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

export default router;
