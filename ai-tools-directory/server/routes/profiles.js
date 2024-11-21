import express from 'express';
import { auth } from '../middleware/auth.js';
import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.userId })
      .populate('user', 'username email')
      .populate('toolHistory.tool')
      .populate('notes.tool');
    
    if (!profile) {
      // Create profile if it doesn't exist
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      profile = new UserProfile({ user: req.userId });
      await profile.save();
      
      // Populate the newly created profile
      profile = await UserProfile.findOne({ user: req.userId })
        .populate('user', 'username email')
        .populate('toolHistory.tool')
        .populate('notes.tool');
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile
router.patch('/me', auth, async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const profile = await UserProfile.findOne({ user: req.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    if (bio) profile.bio = bio;
    if (avatar) profile.avatar = avatar;
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add tool to history
router.post('/history/:toolId', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.userId });
    const toolId = req.params.toolId;
    
    const historyIndex = profile.toolHistory.findIndex(
      h => h.tool.toString() === toolId
    );
    
    if (historyIndex > -1) {
      profile.toolHistory[historyIndex].useCount += 1;
      profile.toolHistory[historyIndex].lastUsed = new Date();
    } else {
      profile.toolHistory.push({ tool: toolId });
    }
    
    await profile.save();
    res.json(profile.toolHistory);
  } catch (error) {
    console.error('Tool history update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add/Update note for a tool
router.post('/notes/:toolId', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.userId });
    const { content } = req.body;
    const toolId = req.params.toolId;
    
    const noteIndex = profile.notes.findIndex(
      n => n.tool.toString() === toolId
    );
    
    if (noteIndex > -1) {
      profile.notes[noteIndex].content = content;
      profile.notes[noteIndex].updatedAt = new Date();
    } else {
      profile.notes.push({
        tool: toolId,
        content,
      });
    }
    
    await profile.save();
    res.json(profile.notes);
  } catch (error) {
    console.error('Note update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete note for a tool
router.delete('/notes/:toolId', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.userId });
    const toolId = req.params.toolId;
    
    profile.notes = profile.notes.filter(
      note => note.tool.toString() !== toolId
    );
    
    await profile.save();
    res.json(profile.notes);
  } catch (error) {
    console.error('Note deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
