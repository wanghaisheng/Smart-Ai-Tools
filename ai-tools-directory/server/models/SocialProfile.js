import mongoose from 'mongoose';

const socialProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxLength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedPrompts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmartPrompt'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  socialStats: {
    totalFollowers: {
      type: Number,
      default: 0
    },
    totalFollowing: {
      type: Number,
      default: 0
    },
    totalPrompts: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Update social stats when followers/following change
socialProfileSchema.pre('save', async function(next) {
  if (this.isModified('followers') || this.isModified('following')) {
    this.socialStats.totalFollowers = this.followers.length;
    this.socialStats.totalFollowing = this.following.length;
  }
  next();
});

const SocialProfile = mongoose.model('SocialProfile', socialProfileSchema);

export default SocialProfile;
