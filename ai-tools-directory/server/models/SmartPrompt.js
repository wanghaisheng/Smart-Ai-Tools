import mongoose from 'mongoose';

const smartPromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Content Creation', 'Technical', 'Business', 'Creative', 'Education', 'Other'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  variables: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    defaultValue: {
      type: String,
    },
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'shared'],
    default: 'private',
  },
  aiModels: [{
    type: String,
    enum: ['GPT-3', 'GPT-4', 'Claude', 'DALL-E', 'Midjourney', 'Other'],
  }],
  stats: {
    uses: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  version: {
    type: Number,
    default: 1,
  },
  parentPrompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmartPrompt',
  },
}, {
  timestamps: true,
});

// Index for search functionality
smartPromptSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Method to increment usage count
smartPromptSchema.methods.incrementUses = async function() {
  this.stats.uses += 1;
  return this.save();
};

// Method to add rating
smartPromptSchema.methods.addRating = async function(rating) {
  const newTotalRatings = this.stats.totalRatings + 1;
  const oldRatingSum = this.stats.averageRating * this.stats.totalRatings;
  this.stats.averageRating = (oldRatingSum + rating) / newTotalRatings;
  this.stats.totalRatings = newTotalRatings;
  return this.save();
};

const SmartPrompt = mongoose.model('SmartPrompt', smartPromptSchema);

export default SmartPrompt;
