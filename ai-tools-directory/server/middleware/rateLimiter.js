import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  enableOfflineQueue: false
});

// Configure rate limiter options
const rateLimiterOptions = {
  store: new RedisStore({
    // @ts-ignore - Type definitions mismatch
    client: redis,
    prefix: 'rl:prompt:',
    expiry: 60 * 60 // 1 hour in seconds
  }),
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: async (req) => {
    // Get user's subscription tier from request
    const tier = req.user?.subscriptionTier || 'free';
    
    // Define rate limits based on subscription tier
    const limits = {
      free: 100,      // 100 requests per hour
      basic: 500,     // 500 requests per hour
      pro: 2000,      // 2000 requests per hour
      enterprise: 5000 // 5000 requests per hour
    };

    return limits[tier] || limits.free;
  },
  message: {
    error: 'Rate limit exceeded',
    retryAfter: 'Rate limit will reset in {minutes} minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for certain paths or users
  skip: (req) => {
    // Skip for internal requests
    if (req.ip === '127.0.0.1') return true;
    
    // Skip for admin users
    if (req.user?.role === 'admin') return true;
    
    // Skip for certain paths
    const skipPaths = ['/health', '/metrics'];
    if (skipPaths.includes(req.path)) return true;
    
    return false;
  },
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later or upgrade your subscription for higher limits',
      retryAfter: res.getHeader('Retry-After'),
      limit: res.getHeader('X-RateLimit-Limit'),
      remaining: res.getHeader('X-RateLimit-Remaining'),
      reset: res.getHeader('X-RateLimit-Reset')
    });
  },
  // Custom key generator based on user ID and IP
  keyGenerator: (req) => {
    return `${req.user?.id || 'anonymous'}:${req.ip}`;
  },
  // Enable DDoS protection
  trustProxy: true
};

// Create rate limiter middleware
export const rateLimiter = rateLimit(rateLimiterOptions);

// Export Redis client for use in other parts of the application
export const redisClient = redis;
