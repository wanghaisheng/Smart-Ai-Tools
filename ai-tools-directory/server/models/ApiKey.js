import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  lastUsed: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a secure API key before saving
apiKeySchema.pre('save', function(next) {
  if (!this.isModified('token')) {
    return next();
  }

  // Generate a random 32-byte hex string
  this.token = crypto.randomBytes(32).toString('hex');
  next();
});

// Index for faster queries
apiKeySchema.index({ user: 1, createdAt: -1 });
apiKeySchema.index({ token: 1 });

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;
