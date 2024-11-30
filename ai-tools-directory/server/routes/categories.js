import express from 'express';
import Category from '../models/Category.js';
import Tool from '../models/Tool.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ name: 1 }) // Sort alphabetically by name
      .select('-__v'); // Exclude version field
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      message: 'Error fetching categories',
      error: error.message 
    });
  }
});

// Get all unique categories with tool counts from Tools collection
router.get('/all', async (req, res) => {
  try {
    // First check if we can connect to the database
    const dbStatus = await Tool.db.db.admin().ping();
    if (!dbStatus) {
      throw new Error('Database connection failed');
    }

    // Get all categories with their counts
    const categoryStats = await Tool.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { category: 1 } }
    ]);

    // If no categories found, return empty array instead of error
    if (!categoryStats || categoryStats.length === 0) {
      return res.json([]);
    }

    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching categories from tools:', error);
    // Send more detailed error message
    res.status(500).json({ 
      message: 'Error fetching categories',
      error: error.message,
      details: 'Database connection or query failed'
    });
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select('-__v');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ 
      message: 'Error fetching category',
      error: error.message 
    });
  }
});

// Get tools count for a category
router.get('/:id/tools-count', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ count: category.toolCount });
  } catch (error) {
    console.error('Error fetching category tools count:', error);
    res.status(500).json({ 
      message: 'Error fetching category tools count',
      error: error.message 
    });
  }
});

export default router;
