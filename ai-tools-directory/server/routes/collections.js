import express from 'express';
import { auth } from '../middleware/auth.js';
import Collection from '../models/Collection.js';
import Tool from '../models/Tool.js';

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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single collection by ID
router.get('/:id', async (req, res) => {
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new collection
router.post('/', auth, async (req, res) => {
  try {
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a collection
router.put('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const { name, description, isPublic, tags } = req.body;

    collection.name = name || collection.name;
    collection.description = description || collection.description;
    collection.isPublic = isPublic !== undefined ? isPublic : collection.isPublic;
    collection.tags = tags || collection.tags;

    await collection.save();
    res.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add tools to a collection
router.post('/:id/add', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const { tools } = req.body;
    if (!Array.isArray(tools)) {
      return res.status(400).json({ message: 'Tools must be an array' });
    }

    // Verify tools exist and add only unique ones
    const validTools = await Tool.find({ _id: { $in: tools } });
    const validToolIds = validTools.map(tool => tool._id);
    
    collection.tools = [...new Set([...collection.tools, ...validToolIds])];
    await collection.save();

    const populatedCollection = await Collection.findById(collection._id)
      .populate('tools', 'name description image');
    
    res.json(populatedCollection);
  } catch (error) {
    console.error('Error adding tools to collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove tools from a collection
router.post('/:id/remove', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const { tools } = req.body;
    if (!Array.isArray(tools)) {
      return res.status(400).json({ message: 'Tools must be an array' });
    }

    collection.tools = collection.tools.filter(
      toolId => !tools.includes(toolId.toString())
    );
    
    await collection.save();

    const populatedCollection = await Collection.findById(collection._id)
      .populate('tools', 'name description image');
    
    res.json(populatedCollection);
  } catch (error) {
    console.error('Error removing tools from collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
