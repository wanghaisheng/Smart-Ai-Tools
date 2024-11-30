import express from 'express';
import { authenticate } from '../middleware/auth.js';
import ApiKey from '../models/ApiKey.js';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';

const router = express.Router();

// Get all API keys for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const apiKeys = await ApiKey.find({ user: req.userId })
      .select('-token') // Don't send tokens in the list
      .sort({ createdAt: -1 });

    res.json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Error fetching API keys', error: error.message });
  }
});

// Create a new API key
router.post('/', [
  authenticate,
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { name } = req.body;

    // Check if user exists
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Create new API key
    const apiKey = new ApiKey({
      user: req.userId,
      name,
      token: crypto.randomBytes(32).toString('hex')
    });

    const savedKey = await apiKey.save();

    // Return the key with token only on creation
    res.status(201).json({
      _id: savedKey._id,
      name: savedKey.name,
      token: savedKey.token,
      createdAt: savedKey.createdAt
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ message: 'Error creating API key', error: error.message });
  }
});

// Delete an API key
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid API key ID' });
    }

    const apiKey = await ApiKey.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Error deleting API key', error: error.message });
  }
});

// Validate an API key (for use in API endpoints)
export const validateApiKey = async (req, res, next) => {
  try {
    const token = req.header('X-API-Key');
    
    if (!token) {
      return res.status(401).json({ message: 'API key required' });
    }

    const apiKey = await ApiKey.findOne({ token }).populate('user');
    
    if (!apiKey) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Update last used timestamp
    apiKey.lastUsed = new Date();
    await apiKey.save();

    // Add user info to request
    req.user = apiKey.user;
    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default router;
