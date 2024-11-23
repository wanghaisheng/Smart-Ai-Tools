import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  prompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmartPrompt',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for comment stats
commentSchema.virtual('stats').get(function() {
  return {
    likesCount: this.likes.length,
    repliesCount: this.replies.length
  };
});

// Update prompt's average rating when a comment is added or modified
commentSchema.post('save', async function() {
  const Prompt = mongoose.model('SmartPrompt');
  const prompt = await Prompt.findById(this.prompt);
  
  if (prompt) {
    const comments = await this.constructor.find({ prompt: this.prompt });
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    prompt.averageRating = totalRating / comments.length;
    await prompt.save();
  }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
