import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    console.log('Registration attempt received:', { 
      email: req.body.email,
      username: req.body.username,
      passwordLength: req.body.password.length
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Registration validation failed:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('Registration failed: User exists:', { email, username });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with password hashing handled by the model
    const user = await User.createUser({
      username,
      email,
      password
    });

    console.log('User created in database:', {
      id: user._id,
      email: user.email
    });

    // Create user profile
    const profile = new UserProfile({ user: user._id });
    await profile.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update user with refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken });

    console.log('Registration successful:', {
      userId: user._id,
      email: user.email
    });

    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  console.log('Login attempt received:', { 
    email: req.body.email,
    passwordReceived: !!req.body.password
  });
  
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login failed: Validation error');
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Processing login:', { 
      emailLength: email.length,
      passwordLength: password.length,
      passwordChars: password.split('').map(c => c.charCodeAt(0))
    });

    // Find user
    const user = await User.findOne({ email });
    console.log('User lookup result:', { 
      found: !!user, 
      email,
      hashedPasswordLength: user ? user.password.length : 0
    });

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password using the model method
    const isMatch = await user.verifyPassword(password);
    console.log('Password verification result:', { isMatch });

    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();
    
    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = refreshToken;
    await user.save();

    console.log('Login successful:', { userId: user._id, email: user.email });
    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Refresh Token
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save new refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ token, refreshToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Clear refresh token
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

export default router;
