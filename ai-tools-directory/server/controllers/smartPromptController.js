import SmartPrompt from '../models/SmartPrompt.js';
import User from '../models/User.js';

// Create a new prompt
export const createPrompt = async (req, res) => {
  try {
    console.log('Creating prompt with data:', {
      body: req.body,
      userId: req.userId,
      headers: req.headers
    });
    
    const promptData = {
      ...req.body,
      creator: req.userId,
    };
    
    const prompt = new SmartPrompt(promptData);
    console.log('Validating prompt:', prompt);
    
    await prompt.save();
    console.log('Prompt saved successfully:', prompt._id);
    
    res.status(201).json(prompt);
  } catch (error) {
    console.error('Error creating prompt:', {
      message: error.message,
      name: error.name,
      errors: error.errors,
      stack: error.stack
    });
    res.status(400).json({ message: error.message, errors: error.errors });
  }
};

// Get prompts with pagination, filters, and access control
export const getPrompts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      visibility,
      userId,
      favorites,
      sharedWith,
      accessibleBy,
      sort = '-createdAt'
    } = req.query;

    let query = {};

    // Handle visibility filters
    if (Array.isArray(visibility)) {
      query.visibility = { $in: visibility };
    } else if (visibility) {
      query.visibility = visibility;
    }

    // Handle user-specific filters
    if (userId) {
      query.creator = userId;
    }

    if (favorites) {
      query['ratings.userId'] = favorites;
    }

    if (sharedWith) {
      query.sharedWith = sharedWith;
    }

    if (accessibleBy) {
      // Show prompts that are either public, created by the user, or shared with the user
      query.$or = [
        { visibility: 'public' },
        { creator: accessibleBy },
        { sharedWith: accessibleBy }
      ];
    }

    // Handle category filter
    if (category) {
      query.category = category;
    }

    // Handle search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const prompts = await SmartPrompt.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('creator', 'username email')
      .lean()
      .exec();

    const totalCount = await SmartPrompt.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      prompts,
      totalPages,
      totalCount,
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error in getPrompts:', error);
    res.status(500).json({ message: 'Error fetching prompts' });
  }
};

// Get a single prompt by ID
export const getPromptById = async (req, res) => {
  try {
    const prompt = await SmartPrompt.findById(req.params.id)
      .populate('creator', 'username email')
      .lean();

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    // Check access rights
    if (prompt.visibility === 'private' && 
        prompt.creator._id.toString() !== req.userId &&
        !prompt.sharedWith.includes(req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      ...prompt,
      isLiked: prompt.likes.includes(req.userId),
      isSaved: prompt.saves.includes(req.userId)
    });
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

    // Check ownership
    if (prompt.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this prompt' });
    }

    const updatedPrompt = await SmartPrompt.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('creator', 'username email');

    res.json(updatedPrompt);
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

    // Check ownership
    if (prompt.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this prompt' });
    }

    await prompt.remove();
    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate a prompt
export const ratePrompt = async (req, res) => {
  try {
    const prompt = await SmartPrompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    await prompt.addRating(req.userId, rating);
    res.json(prompt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle like on a prompt
export const toggleLike = async (req, res) => {
  try {
    console.log('toggleLike controller - Start:', {
      promptId: req.params.id,
      userId: req.userId,
      headers: req.headers
    });

    const prompt = await SmartPrompt.findById(req.params.id);
    if (!prompt) {
      console.log('toggleLike controller - Prompt not found');
      return res.status(404).json({ message: 'Prompt not found' });
    }

    console.log('toggleLike controller - Found prompt:', {
      promptId: prompt._id,
      currentLikes: prompt.likes,
      likesCount: prompt.likes?.length
    });

    await prompt.toggleLike(req.userId);
    await prompt.save();  // Explicitly save again to ensure persistence

    console.log('toggleLike controller - After toggle:', {
      promptId: prompt._id,
      newLikes: prompt.likes,
      newLikesCount: prompt.likes.length,
      isLiked: prompt.likes.includes(req.userId)
    });
    
    res.json({
      likes: prompt.likes.length,
      isLiked: prompt.likes.includes(req.userId)
    });
  } catch (error) {
    console.error('toggleLike controller - Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle save on a prompt
export const toggleSave = async (req, res) => {
  try {
    console.log('toggleSave controller - Start:', {
      promptId: req.params.id,
      userId: req.userId,
      headers: req.headers
    });

    const prompt = await SmartPrompt.findById(req.params.id);
    if (!prompt) {
      console.log('toggleSave controller - Prompt not found');
      return res.status(404).json({ message: 'Prompt not found' });
    }

    console.log('toggleSave controller - Found prompt:', {
      promptId: prompt._id,
      currentSaves: prompt.saves,
      savesCount: prompt.saves?.length
    });

    await prompt.toggleSave(req.userId);
    await prompt.save();  // Explicitly save again to ensure persistence

    console.log('toggleSave controller - After toggle:', {
      promptId: prompt._id,
      newSaves: prompt.saves,
      newSavesCount: prompt.saves.length,
      isSaved: prompt.saves.includes(req.userId)
    });
    
    res.json({
      saves: prompt.saves.length,
      isSaved: prompt.saves.includes(req.userId)
    });
  } catch (error) {
    console.error('toggleSave controller - Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Category mapping for import
const categoryMapping = {
  'Content Writing': 'Content Creation',
  'Technical Documentation': 'Technical',
  'Business Writing': 'Business',
  'Creative Writing': 'Creative',
  'Educational Content': 'Education'
};

// Bulk import prompts
export const bulkImportPrompts = async (req, res) => {
  try {
    const { prompts } = req.body;
    
    if (!Array.isArray(prompts)) {
      return res.status(400).json({ message: 'Prompts must be an array' });
    }

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(400).json({ message: 'Admin user not found' });
    }

    const results = {
      total: prompts.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    for (const promptData of prompts) {
      try {
        // Map category if needed
        const mappedCategory = categoryMapping[promptData.category] || promptData.category;
        
        // Add creator (admin) and set visibility to public by default
        const enrichedPromptData = {
          ...promptData,
          creator: adminUser._id, // Use admin's ID instead of the requesting user's ID
          visibility: 'public',
          category: mappedCategory
        };

        // Create and validate the prompt
        const prompt = new SmartPrompt(enrichedPromptData);
        await prompt.save();
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          title: promptData.title,
          error: error.message,
          details: error.errors
        });
        console.error('Error importing prompt:', {
          title: promptData.title,
          error: error.message,
          details: error.errors
        });
      }
    }

    res.status(200).json({
      message: 'Bulk import completed',
      results
    });
  } catch (error) {
    console.error('Error in bulk import:', error);
    res.status(500).json({ message: 'Error processing bulk import', error: error.message });
  }
};

// Update visibility of all prompts for a user
export const updateUserPromptsVisibility = async (req, res) => {
  try {
    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(400).json({ message: 'Admin user not found' });
    }

    const result = await SmartPrompt.updateMany(
      { creator: adminUser._id }, // Update Admin's prompts
      { $set: { visibility: 'public' } }
    );

    res.status(200).json({
      message: 'Successfully updated prompt visibility',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating prompt visibility:', error);
    res.status(500).json({ message: 'Error updating prompt visibility' });
  }
};
