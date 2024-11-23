import express from 'express';
import {
  createPrompt,
  getPrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
  ratePrompt,
} from '../controllers/smartPromptController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPrompts);
router.get('/:id', getPromptById);

// Protected routes
router.post('/', auth, createPrompt);
router.put('/:id', auth, updatePrompt);
router.delete('/:id', auth, deletePrompt);
router.post('/:id/rate', auth, ratePrompt);

export default router;
