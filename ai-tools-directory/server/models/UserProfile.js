import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: {
    type: String,
    maxLength: 500,
  },
  avatar: {
    type: String,
  },
  toolHistory: [{
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool',
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
    useCount: {
      type: Number,
      default: 1,
    },
  }],
  notes: [{
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

export default mongoose.model('UserProfile', userProfileSchema);
