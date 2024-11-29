import jwt from 'jsonwebtoken';

/**
 * Authentication middleware that verifies JWT tokens and adds user info to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please provide a valid authentication token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add full user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      subscriptionTier: decoded.subscriptionTier || 'free',
      permissions: decoded.permissions || []
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Invalid token',
      message: 'Your authentication token is invalid or expired'
    });
  }
};

/**
 * Optional authentication that doesn't require a valid token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        subscriptionTier: decoded.subscriptionTier || 'free',
        permissions: decoded.permissions || []
      };
    }
    next();
  } catch (error) {
    // Continue without user info if token is invalid
    next();
  }
};

/**
 * Middleware to check if user has required subscription tier
 */
export const requireSubscription = (requiredTier) => {
  const tiers = {
    free: 0,
    basic: 1,
    pro: 2,
    enterprise: 3
  };

  return (req, res, next) => {
    const userTier = req.user?.subscriptionTier || 'free';
    
    if (tiers[userTier] >= tiers[requiredTier]) {
      next();
    } else {
      res.status(403).json({
        error: 'Subscription required',
        message: `This feature requires a ${requiredTier} subscription or higher`,
        requiredTier,
        currentTier: userTier
      });
    }
  };
};

/**
 * Middleware to check if user has required permissions
 */
export const requirePermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];
    
    const hasAllPermissions = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    );
    
    if (hasAllPermissions) {
      next();
    } else {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have the required permissions for this action',
        requiredPermissions,
        currentPermissions: userPermissions
      });
    }
  };
};
