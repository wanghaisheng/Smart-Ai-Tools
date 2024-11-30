# Smart AI Tools Admin Panel Documentation

## 📑 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [API Endpoints](#api-endpoints)
5. [File Structure](#file-structure)
6. [Authentication](#authentication)
7. [Database Schema](#database-schema)
8. [Charts and Analytics](#charts-and-analytics)
9. [Security](#security)
10. [Error Handling](#error-handling)

## 🔍 Overview
The Smart AI Tools Admin Panel is a comprehensive dashboard for managing AI tools, user data, prompts, and analytics. Built with Node.js, Express, MongoDB, and EJS templating.

### Tech Stack
- Backend: Node.js + Express.js
- Database: MongoDB
- Frontend: EJS Templates + Bootstrap 5.1.3
- Authentication: JWT
- Charts: Chart.js
- Icons: Bootstrap Icons

## 🏗 Architecture

### Backend Structure
```
server/
├── routes/
│   ├── admin.js          # Admin routes
│   ├── auth.js           # Authentication routes
│   └── api.js            # API routes
├── models/
│   ├── User.js           # User model
│   ├── Tool.js           # AI Tool model
│   ├── Prompt.js         # Prompt model
│   └── Category.js       # Category model
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── admin.js          # Admin access middleware
└── views/
    └── admin/
        ├── dashboard.ejs
        ├── tools-manager.ejs
        ├── prompts-manager.ejs
        ├── users.ejs
        ├── analytics.ejs
        └── settings.ejs
```

## 🎯 Features

### 1. Dashboard
- Quick statistics overview
- Recent activities
- System health metrics
- User engagement metrics
- Error rate monitoring

### 2. Tools Manager
```javascript
// Key Functions
- addTool(toolData)
- updateTool(toolId, updates)
- deleteTool(toolId)
- listTools(filters)
- searchTools(query)
```

Features:
- CRUD operations for AI tools
- Category management
- Tool status tracking
- Usage statistics
- Rating system

### 3. Prompts Manager
```javascript
// Key Functions
- createPrompt(promptData)
- updatePrompt(promptId, updates)
- deletePrompt(promptId)
- listPrompts(filters)
- searchPrompts(query)
```

Features:
- Template management
- Variable handling
- Category organization
- Version control
- Usage tracking

### 4. User Management
```javascript
// Key Functions
- listUsers(filters)
- getUserDetails(userId)
- updateUserStatus(userId, status)
- deleteUser(userId)
- exportUserData()
```

Features:
- User statistics
- Activity monitoring
- Role management
- Usage analytics
- Export functionality

### 5. Analytics
```javascript
// Key Functions
- getVisitStats()
- getUserMetrics()
- getToolUsageStats()
- getPromptPerformance()
- generateReports()
```

Features:
- Traffic analysis
- User demographics
- Tool usage patterns
- Performance metrics
- Custom date ranges

## 🔌 API Endpoints

### Authentication
```
POST /api/admin/login
POST /api/admin/logout
POST /api/admin/refresh-token
```

### Tools Management
```
GET    /api/admin/tools
POST   /api/admin/tools
GET    /api/admin/tools/:id
PUT    /api/admin/tools/:id
DELETE /api/admin/tools/:id
```

### Prompts Management
```
GET    /api/admin/prompts
POST   /api/admin/prompts
GET    /api/admin/prompts/:id
PUT    /api/admin/prompts/:id
DELETE /api/admin/prompts/:id
```

### User Management
```
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/users/export
```

### Analytics
```
GET /api/admin/analytics/visits
GET /api/admin/analytics/users
GET /api/admin/analytics/tools
GET /api/admin/analytics/prompts
GET /api/admin/analytics/export
```

## 📁 Database Schema

### User Schema
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String,
  status: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Tool Schema
```javascript
{
  name: String,
  description: String,
  category: ObjectId,
  websiteUrl: String,
  status: String,
  ratings: [{
    user: ObjectId,
    rating: Number,
    review: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Prompt Schema
```javascript
{
  title: String,
  description: String,
  template: String,
  category: ObjectId,
  variables: [String],
  version: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 📊 Charts and Analytics

### Implementation
```javascript
// Chart.js Configuration
const chartConfig = {
  type: 'line',
  data: {
    datasets: [{
      label: 'Users',
      borderColor: '#6c5dd3',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  }
};
```

### Available Charts
1. User Growth Chart
2. Tool Usage Chart
3. Prompt Performance Chart
4. Traffic Analysis Chart
5. Demographics Doughnut Chart

## 🔒 Security

### Authentication Flow
1. Admin login with credentials
2. JWT token generation
3. Token verification middleware
4. Protected route access
5. Token refresh mechanism

### Security Measures
- JWT Authentication
- Rate Limiting
- Input Validation
- XSS Protection
- CSRF Protection
- Secure Headers

## ⚠️ Error Handling

### Global Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status
    }
  });
});
```

### Error Types
1. Authentication Errors
2. Validation Errors
3. Database Errors
4. Rate Limit Errors
5. Network Errors

## 🔄 Middleware Pipeline

### Request Flow
1. Rate Limiter
2. Body Parser
3. Authentication
4. Admin Authorization
5. Route Handler
6. Error Handler
7. Response

## 📱 Responsive Design

### Breakpoints
```css
// Mobile First Design
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 992px) { /* Large devices */ }
@media (min-width: 1200px) { /* Extra large devices */ }
```

## 🎨 Theme Customization

### Color Palette
```css
:root {
  --primary: #6c5dd3;
  --secondary: #4caf50;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
  --dark: #1a1d21;
}
```

## 🔧 Configuration

### Environment Variables
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart-ai-tools
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 📦 Dependencies

### Core Dependencies
- express: ^4.17.1
- mongoose: ^6.0.12
- jsonwebtoken: ^8.5.1
- bcryptjs: ^2.4.3
- chart.js: ^3.6.0
- bootstrap: ^5.1.3

### Development Dependencies
- nodemon: ^2.0.15
- jest: ^27.3.1
- supertest: ^6.1.6

## 🚀 Deployment

### Production Setup
1. Environment configuration
2. Database optimization
3. Asset compression
4. SSL/TLS setup
5. Monitoring setup

## 📈 Performance Optimization

### Strategies
1. Database indexing
2. Query optimization
3. Caching implementation
4. Asset minification
5. Load balancing

## 📝 Logging

### Log Categories
1. Access Logs
2. Error Logs
3. Security Logs
4. Performance Logs
5. Audit Logs

## 🔍 Monitoring

### Metrics Tracked
1. Server Health
2. Database Performance
3. API Response Times
4. Error Rates
5. User Activity

## 🔄 Backup & Recovery

### Backup Strategy
1. Database backups
2. File system backups
3. Configuration backups
4. Recovery procedures
5. Backup verification

---

## 📚 Additional Resources

### Documentation
- [API Documentation](./api-docs.md)
- [Development Guide](./dev-guide.md)
- [Deployment Guide](./deploy-guide.md)

### Support
For technical support or feature requests, please contact:
- Email: support@smartaitools.com
- GitHub Issues: [Project Repository](https://github.com/smartaitools/admin-panel)

---

*Last Updated: [Current Date]*
*Version: 1.0.0*
