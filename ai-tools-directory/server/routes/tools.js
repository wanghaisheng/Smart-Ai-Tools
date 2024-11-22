import express from 'express';
import { auth } from '../middleware/auth.js';
import Tool from '../models/Tool.js';
import { scrapeWebsiteData } from '../services/websiteScraper.js';

const router = express.Router();

const buildQuery = (queryParams) => {
  const { category, status = 'approved', search } = queryParams;
  const query = { status };
  
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }
  
  return query;
};

const buildSort = (sortParam = '-createdAt') => {
  switch (sortParam) {
    case 'rating-desc':
      return { 'rating.average': -1 };
    case 'rating-asc':
      return { 'rating.average': 1 };
    case 'name-asc':
      return { name: 1 };
    case 'name-desc':
      return { name: -1 };
    default:
      return { createdAt: -1 };
  }
};

// Get user's submitted tools
router.get('/submitted', auth, async (req, res) => {
  try {
    const tools = await Tool.find({ submittedBy: req.userId })
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .lean();
    
    res.json(tools);
  } catch (error) {
    console.error('Get submitted tools error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tools (with pagination and filters)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 28 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = buildQuery(req.query);
    const sort = buildSort(req.query.sort);
    
    const [tools, total] = await Promise.all([
      Tool.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sort)
        .populate('submittedBy', 'username')
        .lean(),
      Tool.countDocuments(query)
    ]);
    
    res.json({
      tools,
      total,
      pages: Math.ceil(total / parseInt(limit))
    });
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

// Scrape website data for a tool
router.post('/:id/scrape', auth, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    // Check if we've scraped recently (within last 24 hours)
    const lastScraped = tool.scrapedData?.lastScraped;
    if (lastScraped && (Date.now() - new Date(lastScraped).getTime()) < 24 * 60 * 60 * 1000) {
      return res.json({ 
        message: 'Using cached data',
        scrapedData: tool.scrapedData 
      });
    }

    // Scrape fresh data
    const scrapedData = await scrapeWebsiteData(tool.website);
    
    // Update tool with new data
    tool.scrapedData = {
      ...scrapedData,
      lastScraped: new Date()
    };
    
    await tool.save();
    
    res.json({ 
      message: 'Successfully scraped website data',
      scrapedData: tool.scrapedData 
    });
    
  } catch (error) {
    console.error('Website scraping error:', error);
    res.status(500).json({ 
      message: 'Error scraping website data', 
      error: error.message 
    });
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
      image
    } = req.body;
    
    const tool = new Tool({
      name,
      description,
      website,
      category,
      pricing,
      features,
      tags: tags || [],
      image,
      submittedBy: req.userId,
      status: 'pending'
    });
    
    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    console.error('Submit tool error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a tool
router.put('/:id', auth, async (req, res) => {
  try {
    const tool = await Tool.findOne({
      _id: req.params.id,
      submittedBy: req.userId
    });
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    const {
      name,
      description,
      website,
      category,
      pricing,
      features,
      tags,
      image
    } = req.body;
    
    Object.assign(tool, {
      name,
      description,
      website,
      category,
      pricing,
      features,
      tags: tags || tool.tags,
      image: image || tool.image,
      status: 'pending'
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
      submittedBy: req.userId
    });
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Delete tool error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
