# AI Tools Directory - Backend Documentation

## 🏗️ Server Architecture

### Core Components
```
server/
├── controllers/     # Business logic
├── models/         # Database schemas
├── routes/         # API endpoints
├── middleware/     # Custom middleware
├── services/       # External services
├── validators/     # Input validation
├── config/         # Configuration
└── scripts/        # Utility scripts
```

## 📊 Database Models

### 1. User Model (`models/User.js`)
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String,
  isVerified: Boolean,
  lastLogin: Date,
  settings: {
    theme: String,
    notifications: Boolean,
    language: String
  }
}
```

### 2. Tool Model (`models/Tool.js`)
```javascript
{
  name: String,
  description: String,
  category: ObjectId,
  tags: [String],
  website: String,
  pricing: {
    type: String,
    plans: [{
      name: String,
      price: Number,
      features: [String]
    }]
  },
  rating: Number,
  reviews: [ObjectId],
  status: String
}
```

### 3. Smart Prompt Model (`models/SmartPrompt.js`)
```javascript
{
  title: String,
  content: String,
  category: String,
  tags: [String],
  author: ObjectId,
  visibility: String,
  metadata: {
    model: String,
    type: String,
    tone: String,
    length: String
  }
}
```

## 🛣️ API Endpoints

### Authentication Routes (`routes/auth.js`)
\`\`\`
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify-email
\`\`\`

### Tool Routes (`routes/tools.js`)
\`\`\`
GET    /api/tools
POST   /api/tools
GET    /api/tools/:id
PUT    /api/tools/:id
DELETE /api/tools/:id
POST   /api/tools/:id/rate
POST   /api/tools/:id/review
GET    /api/tools/search
GET    /api/tools/categories
\`\`\`

### User Routes (`routes/users.js`)
\`\`\`
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/favorites
POST   /api/users/favorites/:toolId
DELETE /api/users/favorites/:toolId
GET    /api/users/collections
POST   /api/users/collections
\`\`\`

### Smart Prompts Routes (`routes/generate-prompt.js`)
\`\`\`
POST   /api/generate-prompt
GET    /api/prompts
POST   /api/prompts
GET    /api/prompts/:id
PUT    /api/prompts/:id
DELETE /api/prompts/:id
\`\`\`

### Admin Routes (`routes/admin.js`)
\`\`\`
GET    /api/admin/dashboard
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/tools
PUT    /api/admin/tools/:id
DELETE /api/admin/tools/:id
\`\`\`

## 🔒 Middleware Implementation

### Authentication Middleware
```javascript
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

### Role-based Access Control
```javascript
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

## 🔌 Service Integrations

### 1. AI Service Integration
```javascript
class AIService {
  async generatePrompt(topic, options) {
    const { model, type, tone, length } = options;
    // Implementation
  }
  
  async analyzeText(text) {
    // Implementation
  }
  
  async getChatResponse(message, context) {
    // Implementation
  }
}
```

### 2. Email Service
```javascript
class EmailService {
  async sendVerification(user) {
    // Implementation
  }
  
  async sendPasswordReset(user) {
    // Implementation
  }
  
  async sendNotification(user, notification) {
    // Implementation
  }
}
```

## 🔍 Input Validation

### Tool Validation Schema
```javascript
const toolSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10),
  category: Joi.string().required(),
  website: Joi.string().uri().required(),
  pricing: Joi.object({
    type: Joi.string().valid('free', 'paid', 'freemium'),
    plans: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0),
        features: Joi.array().items(Joi.string())
      })
    )
  })
});
```

### User Validation Schema
```javascript
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
  settings: Joi.object({
    theme: Joi.string().valid('light', 'dark'),
    notifications: Joi.boolean(),
    language: Joi.string().length(2)
  })
});
```

## 📊 Database Operations

### Tool Operations
```javascript
// Create Tool
const createTool = async (toolData) => {
  const tool = new Tool(toolData);
  await tool.save();
  return tool;
};

// Update Tool
const updateTool = async (id, updates) => {
  const tool = await Tool.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );
  return tool;
};

// Delete Tool
const deleteTool = async (id) => {
  await Tool.findByIdAndDelete(id);
};
```

### User Operations
```javascript
// Create User
const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({
    ...userData,
    password: hashedPassword
  });
  await user.save();
  return user;
};

// Update User
const updateUser = async (id, updates) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );
  return user;
};
```

## 🔒 Security Implementation

### Password Hashing
```javascript
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
```

### JWT Token Management
```javascript
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

## 🔄 Error Handling

### Custom Error Classes
```javascript
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends APIError {
  constructor(message) {
    super(message, 400);
  }
}
```

### Error Handler Middleware
```javascript
const errorHandler = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  console.error(err);
  res.status(500).json({
    error: 'Internal server error'
  });
};
```

## 📈 Performance Optimization

### Caching Implementation
```javascript
const cache = new NodeCache({ stdTTL: 600 });

const cacheMiddleware = (duration) => (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  res.originalJson = res.json;
  res.json = (body) => {
    cache.set(key, body, duration);
    res.originalJson(body);
  };
  next();
};
```

### Query Optimization
```javascript
// Optimized tool query with pagination
const getTools = async (page, limit, filters) => {
  const query = Tool.find(filters)
    .select('name description category rating')
    .populate('category', 'name')
    .sort({ rating: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const [tools, total] = await Promise.all([
    query.exec(),
    Tool.countDocuments(filters)
  ]);

  return {
    tools,
    total,
    pages: Math.ceil(total / limit)
  };
};
```

## 🧪 Testing Implementation

### Unit Tests
```javascript
describe('User Service', () => {
  test('should create new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const user = await createUser(userData);
    expect(user).toHaveProperty('_id');
    expect(user.email).toBe(userData.email);
  });
});
```

### Integration Tests
```javascript
describe('Tool API', () => {
  test('should create new tool', async () => {
    const response = await request(app)
      .post('/api/tools')
      .send(toolData)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });
});
```

## 📝 API Documentation

### Tool Endpoints

#### Create Tool
\`\`\`
POST /api/tools
Body: {
  name: string
  description: string
  category: string
  website: string
  pricing: {
    type: string
    plans: Array<{
      name: string
      price: number
      features: string[]
    }>
  }
}
Response: {
  _id: string
  name: string
  ...toolData
}
\`\`\`

#### Get Tool
\`\`\`
GET /api/tools/:id
Response: {
  _id: string
  name: string
  description: string
  category: {
    _id: string
    name: string
  }
  rating: number
  reviews: Array<{
    user: {
      _id: string
      username: string
    }
    rating: number
    comment: string
  }>
}
\`\`\`

## 🚀 Deployment Guide

### Environment Variables
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY=your-aws-key
AWS_SECRET_KEY=your-aws-secret
```

### Production Configuration
```javascript
module.exports = {
  env: 'production',
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  },
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
};
```

## 🔄 Database Migrations

### Migration Script
```javascript
const migration = {
  async up() {
    await db.collection('tools').updateMany(
      {},
      {
        $set: {
          status: 'active',
          lastUpdated: new Date()
        }
      }
    );
  },
  
  async down() {
    await db.collection('tools').updateMany(
      {},
      {
        $unset: {
          status: "",
          lastUpdated: ""
        }
      }
    );
  }
};
```

## 📊 Monitoring and Logging

### Logger Configuration
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'combined.log'
    })
  ]
});
```

### Performance Monitoring
```javascript
const responseTime = require('response-time');

app.use(responseTime((req, res, time) => {
  logger.info({
    method: req.method,
    url: req.url,
    responseTime: time
  });
}));
```
