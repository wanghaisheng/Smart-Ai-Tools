import express from 'express';
import { auth } from '../middleware/auth.js';
import ProviderApiKey from '../models/ProviderApiKey.js';
import { body, param, validationResult } from 'express-validator';
import axios from 'axios';

const router = express.Router();

// Get all provider API keys for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const apiKeys = await ProviderApiKey.find({ user: req.userId })
      .select('-apiKey') // Don't send the encrypted key
      .sort({ updatedAt: -1 });

    // Format response to match frontend expectations
    const formattedKeys = apiKeys.reduce((acc, key) => {
      acc[key.provider] = {
        isValid: key.isValid,
        isEnabled: key.isEnabled,
        enabledModels: Object.fromEntries(key.enabledModels),
        lastTested: key.lastTested
      };
      return acc;
    }, {});

    res.json(formattedKeys);
  } catch (error) {
    console.error('Error fetching provider API keys:', error);
    res.status(500).json({ message: 'Error fetching API keys', error: error.message });
  }
});

// Save or update a provider API key
router.post('/:provider', [
  auth,
  param('provider').isIn(ProviderApiKey.schema.path('provider').enumValues),
  body('apiKey').trim().notEmpty().withMessage('API key is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { provider } = req.params;
    const { apiKey } = req.body;

    let providerKey = await ProviderApiKey.findOne({
      user: req.userId,
      provider
    });

    if (providerKey) {
      providerKey.apiKey = apiKey;
    } else {
      providerKey = new ProviderApiKey({
        user: req.userId,
        provider,
        apiKey
      });
    }

    // Test the API key before saving
    const isValid = await testProviderApiKey(provider, apiKey);
    providerKey.isValid = isValid;
    providerKey.lastTested = new Date();

    if (isValid) {
      // If valid, enable all available models by default
      const availableModels = ProviderApiKey.getProviderModels(provider);
      availableModels.forEach(model => {
        providerKey.enabledModels.set(model, true);
      });
    }

    await providerKey.save();

    res.json({
      provider,
      isValid,
      isEnabled: providerKey.isEnabled,
      enabledModels: Object.fromEntries(providerKey.enabledModels),
      lastTested: providerKey.lastTested
    });
  } catch (error) {
    console.error('Error saving provider API key:', error);
    res.status(500).json({ message: 'Error saving API key', error: error.message });
  }
});

// Test an API key
router.post('/:provider/test', [
  auth,
  param('provider').isIn(ProviderApiKey.schema.path('provider').enumValues),
], async (req, res) => {
  try {
    const { provider } = req.params;
    
    const providerKey = await ProviderApiKey.findOne({
      user: req.userId,
      provider
    });

    if (!providerKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    const decryptedKey = providerKey.getDecryptedKey();
    const isValid = await testProviderApiKey(provider, decryptedKey);

    providerKey.isValid = isValid;
    providerKey.lastTested = new Date();
    await providerKey.save();

    res.json({ isValid, lastTested: providerKey.lastTested });
  } catch (error) {
    console.error('Error testing API key:', error);
    res.status(500).json({ message: 'Error testing API key', error: error.message });
  }
});

// Toggle provider enabled status
router.patch('/:provider/toggle', [
  auth,
  param('provider').isIn(ProviderApiKey.schema.path('provider').enumValues),
], async (req, res) => {
  try {
    const { provider } = req.params;
    
    const providerKey = await ProviderApiKey.findOne({
      user: req.userId,
      provider
    });

    if (!providerKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    providerKey.isEnabled = !providerKey.isEnabled;
    await providerKey.save();

    res.json({ isEnabled: providerKey.isEnabled });
  } catch (error) {
    console.error('Error toggling provider:', error);
    res.status(500).json({ message: 'Error toggling provider', error: error.message });
  }
});

// Toggle model enabled status
router.patch('/:provider/models/:modelName/toggle', [
  auth,
  param('provider').isIn(ProviderApiKey.schema.path('provider').enumValues),
], async (req, res) => {
  try {
    const { provider, modelName } = req.params;
    
    const providerKey = await ProviderApiKey.findOne({
      user: req.userId,
      provider
    });

    if (!providerKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    const currentStatus = providerKey.enabledModels.get(modelName) || false;
    await providerKey.toggleModel(modelName, !currentStatus);

    res.json({ 
      modelName,
      enabled: !currentStatus,
      enabledModels: Object.fromEntries(providerKey.enabledModels)
    });
  } catch (error) {
    console.error('Error toggling model:', error);
    res.status(500).json({ message: 'Error toggling model', error: error.message });
  }
});

// Delete a provider API key
router.delete('/:provider', [
  auth,
  param('provider').isIn(ProviderApiKey.schema.path('provider').enumValues),
], async (req, res) => {
  try {
    const { provider } = req.params;

    const result = await ProviderApiKey.findOneAndDelete({
      user: req.userId,
      provider
    });

    if (!result) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Error deleting API key', error: error.message });
  }
});

// Helper function to test provider API keys
async function testProviderApiKey(provider, apiKey) {
  try {
    switch (provider) {
      case 'openai':
        const openaiResponse = await axios.get('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        return openaiResponse.status === 200;

      case 'anthropic':
        const anthropicResponse = await axios.get('https://api.anthropic.com/v1/models', {
          headers: { 'x-api-key': apiKey }
        });
        return anthropicResponse.status === 200;

      case 'gemini':
        const geminiResponse = await axios.get('https://generativelanguage.googleapis.com/v1beta/models', {
          params: {
            key: apiKey
          }
        });
        return geminiResponse.status === 200;

      // Add more provider-specific validation logic here

      default:
        return false;
    }
  } catch (error) {
    console.error(`Error testing ${provider} API key:`, error);
    return false;
  }
}

export default router;
