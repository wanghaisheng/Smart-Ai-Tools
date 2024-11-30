import express from 'express';
import { authenticate, requireSubscription } from '../middleware/auth.js';
import { validatePromptGeneration } from '../middleware/validation.js';
import {
  generatePrompt,
  analyzePrompt,
  refinePrompt,
  getPromptHistory,
  getPromptTemplates,
  savePromptTemplate,
  deletePromptTemplate
} from '../controllers/aiPromptController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Basic prompt operations - available to all authenticated users
router.get('/history', getPromptHistory);
router.get('/templates', getPromptTemplates);

// Advanced operations - require subscription
router.post('/generate', 
  requireSubscription(['pro', 'enterprise']), 
  validatePromptGeneration,
  generatePrompt
);

router.post('/analyze', 
  requireSubscription(['pro', 'enterprise']), 
  analyzePrompt
);

router.post('/refine', 
  requireSubscription(['pro', 'enterprise']), 
  refinePrompt
);

// Template management
router.post('/templates', 
  requireSubscription(['pro', 'enterprise']), 
  savePromptTemplate
);

router.delete('/templates/:id', 
  requireSubscription(['pro', 'enterprise']), 
  deletePromptTemplate
);

export default router;
