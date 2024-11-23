import express from 'express';
import { auth } from '../middleware/auth.js';
import ProviderApiKey from '../models/ProviderApiKey.js';

const router = express.Router();

// Get available AI models from configured API keys
router.get('/available-models', auth, async (req, res) => {
  try {
    // Get all enabled provider API keys for the user
    const providerKeys = await ProviderApiKey.find({
      user: req.userId,
      isEnabled: true,
      isValid: true
    });

    // Collect all available models from enabled providers
    const models = [];
    for (const key of providerKeys) {
      const providerModels = ProviderApiKey.getProviderModels(key.provider);
      providerModels.forEach(modelId => {
        if (key.enabledModels.get(modelId)) {
          models.push({
            id: `${key.provider}/${modelId}`,
            name: modelId,
            provider: key.provider
          });
        }
      });
    }

    res.json({ models });
  } catch (error) {
    console.error('Error fetching available models:', error);
    res.status(500).json({ message: 'Error fetching available models' });
  }
});

export default router;
