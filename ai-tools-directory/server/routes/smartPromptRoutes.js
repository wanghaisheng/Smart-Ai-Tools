import express from 'express';
import {
  createPrompt,
  getPrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
  ratePrompt,
  toggleLike,
  toggleSave,
  bulkImportPrompts,
  updateUserPromptsVisibility,
  saveModifiedPrompt
} from '../controllers/smartPromptController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPrompts); // Can handle both public and authenticated requests
router.get('/:id', getPromptById); // Access control handled in controller

// Protected routes - require authentication
router.use(authenticate); // Apply auth middleware to all routes below
router.post('/', createPrompt);
router.post('/bulk', bulkImportPrompts);
router.put('/:id', updatePrompt);
router.delete('/:id', deletePrompt);
router.post('/:id/rate', ratePrompt);
router.post('/:id/like', toggleLike);
router.post('/:id/save', toggleSave);
router.post('/update-visibility', updateUserPromptsVisibility);
router.post('/:id/save-modified', saveModifiedPrompt);

export default router;
