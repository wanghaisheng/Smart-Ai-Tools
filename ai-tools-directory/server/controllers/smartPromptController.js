import SmartPrompt from '../models/SmartPrompt.js';

// Create a new prompt
export const createPrompt = async (req, res) => {
  try {
    const promptData = {
      ...req.body,
      creator: req.userId, // Updated to use userId from auth middleware
    };
    
    const prompt = new SmartPrompt(promptData);
    await prompt.save();
    
    res.status(201).json(prompt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all public prompts with pagination and filters
export const getPrompts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sort = '-createdAt'
    } = req.query;

    const query = { visibility: 'public' };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const prompts = await SmartPrompt.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creator', 'name email')
      .exec();

    const count = await SmartPrompt.countDocuments(query);

    res.json({
      prompts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPrompts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single prompt by ID
export const getPromptById = async (req, res) => {
  try {
    const prompt = await SmartPrompt.findById(req.params.id)
      .populate('creator', 'name email');
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    // Check if prompt is private and user is not the creator
    if (prompt.visibility === 'private' && 
        (!req.userId || prompt.creator._id.toString() !== req.userId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a prompt
export const updatePrompt = async (req, res) => {
  try {
    const prompt = await SmartPrompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    // Check if user is the creator
    if (prompt.creator.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create new version if content is modified
    if (req.body.content && req.body.content !== prompt.content) {
      const newVersion = new SmartPrompt({
        ...prompt.toObject(),
        _id: undefined,
        version: prompt.version + 1,
        parentPrompt: prompt._id,
        ...req.body,
      });
      await newVersion.save();
      return res.json(newVersion);
    }

    // Update existing prompt
    Object.assign(prompt, req.body);
    await prompt.save();
    res.json(prompt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a prompt
export const deletePrompt = async (req, res) => {
  try {
    const prompt = await SmartPrompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    // Check if user is the creator
    if (prompt.creator.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prompt.deleteOne(); // Updated to use deleteOne() instead of remove()
    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate a prompt
export const ratePrompt = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value' });
    }

    const prompt = await SmartPrompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    await prompt.addRating(rating);
    res.json(prompt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
