import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool'
  }],
  notificationSettings: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.verificationToken;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      return ret;
    }
  }
});

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified('password')) {
    return next();
  }

  console.log('Hashing password in pre-save middleware');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Static method to create a new user with proper password hashing
userSchema.statics.createUser = async function(userData) {
  console.log('Creating new user with createUser method');
  const user = new this(userData);
  await user.save();
  return user;
};

// Method to verify password
userSchema.methods.verifyPassword = async function(candidatePassword) {
  console.log('Verifying password:', {
    candidateLength: candidatePassword.length,
    storedHashLength: this.password.length
  });
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
