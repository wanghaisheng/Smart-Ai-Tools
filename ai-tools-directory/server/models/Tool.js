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
  category: {
    type: String,
    required: true,
    trim: true,
  },
  pricing: {
    type: String,
    enum: ['Free', 'Freemium', 'Paid', 'Contact for Pricing'],
    required: true,
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
toolSchema.index({ name: 'text', description: 'text', tags: 'text' });
toolSchema.index({ category: 1 });
toolSchema.index({ status: 1 });

const Tool = mongoose.model('Tool', toolSchema);

export default Tool;
