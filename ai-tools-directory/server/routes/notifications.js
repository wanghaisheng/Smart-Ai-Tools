import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('relatedTool', 'name')
      .populate('relatedReview', 'rating comment');

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});

// Get notification settings for the user
router.get('/settings', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('notificationSettings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.notificationSettings || {
      emailNotifications: true,
      toolUpdates: true,
      newFeatures: true,
      reviewResponses: true
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ message: 'Failed to fetch notification settings', error: error.message });
  }
});

// Update notification settings
router.put('/settings', [
  authenticate,
  body('emailNotifications').isBoolean().withMessage('emailNotifications must be a boolean'),
  body('toolUpdates').isBoolean().withMessage('toolUpdates must be a boolean'),
  body('newFeatures').isBoolean().withMessage('newFeatures must be a boolean'),
  body('reviewResponses').isBoolean().withMessage('reviewResponses must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { notificationSettings: req.body },
      { new: true }
    ).select('notificationSettings');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.notificationSettings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Failed to update notification settings', error: error.message });
  }
});

// Mark a notification as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticate, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.userId, read: false },
      { read: true }
    );

    res.json({ 
      message: 'All notifications marked as read',
      modified: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read', error: error.message });
  }
});

// Delete a notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
});

// Utility function to create a new notification
async function createNotification(userId, message, type, relatedTool = null, relatedReview = null) {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      relatedTool,
      relatedReview
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export { router, createNotification };
