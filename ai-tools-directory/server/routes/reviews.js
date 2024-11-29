import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import Review from '../models/Review.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get user's reviews
router.get('/user', authenticate, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('tool', 'name image url')
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

// Get user's reviews
router.get('/user/me', authenticate, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('tool')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a tool
router.get('/tool/:toolId', optionalAuth, async (req, res) => {
  try {
    const toolId = req.params.toolId;
    const reviews = await Review.find({ tool: toolId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    
    // If user is authenticated, include whether they liked each review
    const reviewsWithLikeStatus = reviews.map(review => ({
      ...review.toObject(),
      isLiked: req.userId ? review.likes.includes(req.userId) : false,
      likesCount: review.likes.length,
    }));
    
    res.json(reviewsWithLikeStatus);
  } catch (error) {
    console.error('Error fetching tool reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

// Create/Update review
router.post('/tool/:toolId', [
  authenticate,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Review must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, content } = req.body;
    const toolId = req.params.toolId;
    
    let existingReview = await Review.findOne({
      user: req.userId,
      tool: toolId
    });
    
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.content = content;
      existingReview.updatedAt = new Date();
      await existingReview.save();
      
      existingReview = await existingReview.populate('user', 'username avatar');
      
      res.json(existingReview);
    } else {
      let newReview = new Review({
        user: req.userId,
        tool: toolId,
        rating,
        content
      });
      
      await newReview.save();
      newReview = await newReview.populate('user', 'username avatar');
      
      res.status(201).json(newReview);
    }
  } catch (error) {
    console.error('Error creating/updating review:', error);
    res.status(500).json({ message: 'Failed to save review', error: error.message });
  }
});

// Delete review
router.delete('/:reviewId', authenticate, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.userId
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }
    
    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
});

// Like/Unlike review
router.post('/:reviewId/like', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const likeIndex = review.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      review.likes.splice(likeIndex, 1);
    } else {
      review.likes.push(req.userId);
    }
    
    await review.save();
    
    res.json({
      likes: review.likes,
      likesCount: review.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Error updating review likes:', error);
    res.status(500).json({ message: 'Failed to update likes', error: error.message });
  }
});

export default router;
