import express from 'express';
import { auth, optionalAuth } from '../middleware/auth.js';
import Review from '../models/Review.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get user's reviews
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('tool', 'name image url')
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/user/me', auth, async (req, res) => {
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Create/Update review
router.post('/tool/:toolId',
  [
    auth,
    body('rating').isInt({ min: 1, max: 5 }),
    body('review').trim().isLength({ min: 1, max: 1000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { rating, review } = req.body;
      const toolId = req.params.toolId;
      
      let existingReview = await Review.findOne({
        user: req.userId,
        tool: toolId,
      });
      
      if (existingReview) {
        existingReview.rating = rating;
        existingReview.review = review;
        existingReview.updatedAt = new Date();
        await existingReview.save();
        
        existingReview = await Review.findById(existingReview._id)
          .populate('user', 'username avatar');
        
        res.json(existingReview);
      } else {
        let newReview = new Review({
          user: req.userId,
          tool: toolId,
          rating,
          review,
        });
        
        await newReview.save();
        
        newReview = await Review.findById(newReview._id)
          .populate('user', 'username avatar');
        
        res.status(201).json(newReview);
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete review
router.delete('/tool/:toolId', auth, async (req, res) => {
  try {
    const toolId = req.params.toolId;
    
    const review = await Review.findOne({
      user: req.userId,
      tool: toolId,
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike review
router.post('/:reviewId/like', auth, async (req, res) => {
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
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
