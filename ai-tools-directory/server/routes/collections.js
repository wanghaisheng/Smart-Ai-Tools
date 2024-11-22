import express from 'express';
import { auth } from '../middleware/auth.js';
import Collection from '../models/Collection.js';
import Tool from '../models/Tool.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all collections for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.userId })
      .populate('tools', 'name description image')
      .sort({ updatedAt: -1 });
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Failed to fetch collections', error: error.message });
  }
});

// Get public collections
router.get('/public', async (req, res) => {
  try {
    const collections = await Collection.find({ isPublic: true })
      .populate('user', 'username avatar')
      .populate('tools', 'name description image')
      .sort({ updatedAt: -1 });
    res.json(collections);
  } catch (error) {
    console.error('Error fetching public collections:', error);
    res.status(500).json({ message: 'Failed to fetch public collections', error: error.message });
  }
});

// Get a single collection by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('tools', 'name description image');
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if collection is private and user is not the owner
    if (!collection.isPublic && (!req.userId || collection.user._id.toString() !== req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ message: 'Failed to fetch collection', error: error.message });
  }
});

// Create a new collection
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean value'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, isPublic, tags } = req.body;

    const collection = new Collection({
      name,
      description,
      isPublic,
      tags,
      user: req.userId,
      tools: []
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Failed to create collection', error: error.message });
  }
});

// Update a collection
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean value'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const { name, description, isPublic, tags } = req.body;

    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (isPublic !== undefined) collection.isPublic = isPublic;
    if (tags) collection.tags = tags;

    await collection.save();
    res.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Failed to update collection', error: error.message });
  }
});

// Delete a collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    await collection.deleteOne();
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Failed to delete collection', error: error.message });
  }
});

// Add tool to collection
router.post('/:id/tools', [
  auth,
  body('toolId').trim().notEmpty().withMessage('Tool ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const { toolId } = req.body;
    const tool = await Tool.findById(toolId);

    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    if (collection.tools.includes(toolId)) {
      return res.status(400).json({ message: 'Tool already in collection' });
    }

    collection.tools.push(toolId);
    await collection.save();

    res.json(collection);
  } catch (error) {
    console.error('Error adding tool to collection:', error);
    res.status(500).json({ message: 'Failed to add tool to collection', error: error.message });
  }
});

// Remove tool from collection
router.delete('/:id/tools/:toolId', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const toolIndex = collection.tools.indexOf(req.params.toolId);
    if (toolIndex === -1) {
      return res.status(404).json({ message: 'Tool not found in collection' });
    }

    collection.tools.splice(toolIndex, 1);
    await collection.save();

    res.json(collection);
  } catch (error) {
    console.error('Error removing tool from collection:', error);
    res.status(500).json({ message: 'Failed to remove tool from collection', error: error.message });
  }
});

export default router;
