import express from 'express';
import { auth } from '../middleware/auth.js';
import Tool from '../models/Tool.js';

const router = express.Router();

// Get all tools (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, status = 'approved', search, sort = '-createdAt' } = req.query;
    
    const query = { status };
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }
    
    const tools = await Tool.find(query)
      .sort(sort)
      .populate('submittedBy', 'username')
      .lean();
    
    res.json(tools);
  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific tool
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('submittedBy', 'username')
      .lean();
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.json(tool);
  } catch (error) {
    console.error('Get tool error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit a new tool
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      category,
      pricing,
      features,
      tags,
    } = req.body;
    
    const tool = new Tool({
      name,
      description,
      website,
      category,
      pricing,
      features,
      tags,
      submittedBy: req.userId,
    });
    
    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    console.error('Submit tool error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a tool
router.patch('/:id', auth, async (req, res) => {
  try {
    const tool = await Tool.findOne({
      _id: req.params.id,
      submittedBy: req.userId,
    });
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found or unauthorized' });
    }
    
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (key !== 'submittedBy' && key !== 'status') {
        tool[key] = updates[key];
      }
    });
    
    await tool.save();
    res.json(tool);
  } catch (error) {
    console.error('Update tool error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a tool
router.delete('/:id', auth, async (req, res) => {
  try {
    const tool = await Tool.findOneAndDelete({
      _id: req.params.id,
      submittedBy: req.userId,
    });
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found or unauthorized' });
    }
    
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Delete tool error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
