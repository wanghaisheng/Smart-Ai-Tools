import aiPromptService from '../services/aiPromptService.js';

// Generate a new prompt using AI
export const generatePrompt = async (req, res) => {
  try {
    const { input, config } = req.body;
    const userId = req.user.id;
    
    const result = await aiPromptService.generatePrompt(input, config, userId);
    res.json(result);
  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({
      error: 'Failed to generate prompt',
      details: error.message
    });
  }
};

// Analyze prompt quality
export const analyzePrompt = async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const userId = req.user.id;
    
    const metrics = await aiPromptService.analyzeQuality(prompt, context, userId);
    res.json(metrics);
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    res.status(500).json({
      error: 'Failed to analyze prompt',
      details: error.message
    });
  }
};

// Refine existing prompt
export const refinePrompt = async (req, res) => {
  try {
    const { prompt, metrics, config } = req.body;
    const userId = req.user.id;
    
    const refined = await aiPromptService.refinePrompt(prompt, metrics, config, userId);
    res.json(refined);
  } catch (error) {
    console.error('Error refining prompt:', error);
    res.status(500).json({
      error: 'Failed to refine prompt',
      details: error.message
    });
  }
};

// Get user's prompt history
export const getPromptHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await aiPromptService.getPromptHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    res.status(500).json({
      error: 'Failed to fetch prompt history',
      details: error.message
    });
  }
};

// Get available prompt templates
export const getPromptTemplates = async (req, res) => {
  try {
    const { category } = req.query;
    const userId = req.user.id;
    
    const templates = await aiPromptService.getTemplates(category, userId);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      error: 'Failed to fetch templates',
      details: error.message
    });
  }
};

// Save new prompt template
export const savePromptTemplate = async (req, res) => {
  try {
    const { template } = req.body;
    const userId = req.user.id;
    
    const saved = await aiPromptService.saveTemplate(template, userId);
    res.json(saved);
  } catch (error) {
    console.error('Error saving template:', error);
    res.status(500).json({
      error: 'Failed to save template',
      details: error.message
    });
  }
};

// Delete prompt template
export const deletePromptTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await aiPromptService.deleteTemplate(id, userId);
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      error: 'Failed to delete template',
      details: error.message
    });
  }
};
