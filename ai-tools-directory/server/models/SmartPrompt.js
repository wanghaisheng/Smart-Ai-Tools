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
    enum: [
      'Content Creation',
      'Marketing',
      'Business',
      'Education',
      'Creative Writing',
      'Technical',
      'Health & Wellness',
      'Personal Development',
      'Finance',
      'Legal',
      'Social Media',
      'Sales',
      'Human Resources',
      'Travel',
      'E-commerce',
      'Customer Support',
      'Real Estate',
      'Event Planning',
      'News & Media',
      'Science & Research',
      'Gaming',
      'Technology',
      'Food & Beverage',
      'Non-profit & Charity',
      'Retail'
    ],
  },
  subcategory: {
    type: String,
    trim: true,
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
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: [],
  },
  saves: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: [],
  }
}, {
  timestamps: true,
});

// Index for search functionality
smartPromptSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Method to increment usage count
smartPromptSchema.methods.incrementUses = async function() {
  console.log('incrementUses - Start:', {
    promptId: this._id,
    currentUses: this.stats.uses
  });
  this.stats.uses += 1;
  console.log('incrementUses - After update:', {
    promptId: this._id,
    newUses: this.stats.uses
  });
  return this.save();
};

// Method to add rating
smartPromptSchema.methods.addRating = async function(rating) {
  console.log('addRating - Start:', {
    promptId: this._id,
    rating,
    currentAverageRating: this.stats.averageRating,
    currentTotalRatings: this.stats.totalRatings
  });
  const newTotalRatings = this.stats.totalRatings + 1;
  const oldRatingSum = this.stats.averageRating * this.stats.totalRatings;
  this.stats.averageRating = (oldRatingSum + rating) / newTotalRatings;
  this.stats.totalRatings = newTotalRatings;
  console.log('addRating - After update:', {
    promptId: this._id,
    newAverageRating: this.stats.averageRating,
    newTotalRatings: this.stats.totalRatings
  });
  return this.save();
};

// Method to toggle like
smartPromptSchema.methods.toggleLike = async function(userId) {
  console.log('toggleLike - Start:', {
    promptId: this._id,
    userId,
    currentLikes: this.likes,
    likesCount: this.likes?.length
  });

  const userIdStr = userId.toString();
  const index = this.likes.findIndex(id => id.toString() === userIdStr);
  
  if (index === -1) {
    console.log('toggleLike - Adding like');
    this.likes.push(userId);
  } else {
    console.log('toggleLike - Removing like');
    this.likes.splice(index, 1);
  }
  
  console.log('toggleLike - After update:', {
    promptId: this._id,
    userId,
    newLikes: this.likes,
    newLikesCount: this.likes.length
  });

  return this.save();
};

// Method to toggle save
smartPromptSchema.methods.toggleSave = async function(userId) {
  console.log('toggleSave - Start:', {
    promptId: this._id,
    userId,
    currentSaves: this.saves,
    savesCount: this.saves?.length
  });

  const userIdStr = userId.toString();
  const index = this.saves.findIndex(id => id.toString() === userIdStr);
  
  if (index === -1) {
    console.log('toggleSave - Adding save');
    this.saves.push(userId);
  } else {
    console.log('toggleSave - Removing save');
    this.saves.splice(index, 1);
  }
  
  console.log('toggleSave - After update:', {
    promptId: this._id,
    userId,
    newSaves: this.saves,
    newSavesCount: this.saves.length
  });

  return this.save();
};

const SmartPrompt = mongoose.model('SmartPrompt', smartPromptSchema);

export default SmartPrompt;
