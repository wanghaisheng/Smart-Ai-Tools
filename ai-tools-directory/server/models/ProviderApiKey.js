import mongoose from 'mongoose';
import crypto from 'crypto';

const providerApiKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    required: true,
    enum: [
      'openai', 'anthropic', 'gemini', 'groq', 'cohere', 
      'huggingface', 'replicate', 'together', 'ollama',
      'azure', 'deepseek', 'mistral', 'perplexity',
      'openrouter', 'google', 'stability'
    ]
  },
  apiKey: {
    type: String,
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  enabledModels: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  lastTested: {
    type: Date
  },
  isValid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt API key before saving
providerApiKeySchema.pre('save', function(next) {
  if (this.isModified('apiKey')) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(this.apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    this.apiKey = encrypted;
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

// Decrypt API key when retrieving
providerApiKeySchema.methods.getDecryptedKey = function() {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(this.apiKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Instance method to toggle model availability
providerApiKeySchema.methods.toggleModel = function(modelName, enabled) {
  this.enabledModels.set(modelName, enabled);
  return this.save();
};

// Static method to get available models for a provider
providerApiKeySchema.statics.getProviderModels = function(provider) {
  const modelsByProvider = {
    openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    gemini: ['gemini-pro', 'gemini-ultra'],
    groq: ['mixtral-8x7b', 'llama-2-70b'],
    // Add other providers' models here
  };
  return modelsByProvider[provider] || [];
};

// Indexes for performance
providerApiKeySchema.index({ user: 1, provider: 1 }, { unique: true });
providerApiKeySchema.index({ updatedAt: -1 });

const ProviderApiKey = mongoose.model('ProviderApiKey', providerApiKeySchema);

export default ProviderApiKey;
