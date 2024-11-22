import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x225?text=AI+Tool',
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  pricing: {
    type: String,
    enum: ['Free', 'Freemium', 'Paid', 'Contact for Pricing', 'Unknown'],
    required: true,
  },
  scrapedData: {
    features: [{
      type: String,
      trim: true
    }],
    extendedDescription: {
      type: String,
      trim: true
    },
    metadata: {
      title: String,
      metaDescription: String
    },
    lastScraped: {
      type: Date,
      default: null
    }
  },
  features: [{
    type: String,
    trim: true,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
toolSchema.index({ name: 'text', description: 'text' });
toolSchema.index({ category: 1 });
toolSchema.index({ status: 1 });
toolSchema.index({ favoritedBy: 1 });
toolSchema.index({ favoriteCount: -1 });

const Tool = mongoose.model('Tool', toolSchema);

export default Tool;
