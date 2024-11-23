# Smart Prompts Module Documentation

## Table of Contents
1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Frontend Components](#frontend-components)
4. [Pages](#pages)
5. [Services](#services)
6. [API Routes](#api-routes)
7. [State Management](#state-management)
8. [Authentication & Security](#authentication--security)
9. [AI Integration](#ai-integration)
10. [Social Features](#social-features)
11. [Database Schema](#database-schema)
12. [Configuration](#configuration)

## Overview
The Smart Prompts module is a comprehensive prompt management system that allows users to create, manage, share, and interact with AI prompts. It features a modern React frontend with social features and integrates with multiple AI providers.

## Directory Structure
```
src/smartPrompts/
├── components/          # Reusable UI components
│   ├── settings/       # Settings-related components
│   ├── social/         # Social feature components
│   └── common/         # Common UI components
├── pages/              # Main page components
├── services/           # API and business logic services
├── hooks/              # Custom React hooks
├── store/              # State management
├── types/              # TypeScript interfaces
└── utils/              # Utility functions
```

## Frontend Components

### Core Components

#### 1. PromptCard (`components/PromptCard.jsx`)
A reusable component for displaying individual prompts.

**Features:**
- Displays prompt title, description, and metadata
- Like/Save functionality
- Share options
- Edit/Delete for owners
- Rating system

**Key Functions:**
- `handleLike()`: Manages prompt liking
- `handleSave()`: Handles prompt saving
- `handleShare()`: Manages prompt sharing
- `handleRate()`: Handles prompt rating

#### 2. AiPromptGenerator (`components/AiPromptGenerator.jsx`)
AI-powered prompt generation interface.

**Features:**
- Multiple AI model support
- Custom generation parameters
- Template-based generation
- Real-time preview

**Key Functions:**
- `generatePrompt()`: Generates new prompts using AI
- `saveGenerated()`: Saves generated prompts
- `customizeParameters()`: Adjusts generation settings

#### 3. ApiKeyManager (`components/settings/ApiKeyManager.jsx`)
Manages API keys for various AI providers.

**Supported Providers:**
- OpenAI
- Anthropic
- Gemini
- Groq
- Mistral
- Azure OpenAI
- And more...

**Features:**
- Secure key storage
- Key validation
- Provider configuration
- Usage monitoring

### Social Components

#### 1. UserProfile (`components/social/UserProfile.jsx`)
User profile management component.

**Features:**
- Profile information display
- User statistics
- Prompt collection display
- Follow/Unfollow functionality

#### 2. CommentSection (`components/social/CommentSection.jsx`)
Handles prompt comments and discussions.

**Features:**
- Comment threading
- Rich text formatting
- Reactions
- Moderation tools

## Pages

### 1. SmartPromptsPage (`pages/SmartPromptsPage.jsx`)
Main page for prompt management and discovery.

**Features:**
- Prompt listing with filters
- Category navigation
- Search functionality
- View switching (All/My/Public/Favorites/Shared)

**Key Functions:**
- `fetchPrompts()`: Retrieves prompts based on filters
- `handleFilter()`: Manages filter state
- `handleTabChange()`: Handles view switching
- `handleCreatePrompt()`: Creates new prompts

### 2. PromptEditor (`pages/PromptEditor.jsx`)
Advanced prompt creation and editing interface.

**Features:**
- Rich text editing
- Variable support
- Version history
- Template management

## Services

### 1. PromptService (`services/promptService.js`)
Handles all prompt-related API calls.

**Key Functions:**
```javascript
// Get prompts with filtering
getPrompts({ page, limit, search, category, view, userId })

// CRUD operations
getPromptById(id)
createPrompt(promptData)
updatePrompt(id, promptData)
deletePrompt(id)

// Social interactions
ratePrompt(id, rating)
likePrompt(id)
savePrompt(id)
sharePrompt(id, userId)
```

### 2. AIService (`services/aiService.js`)
Manages AI provider integrations.

**Key Functions:**
```javascript
// AI operations
generatePrompt(params)
getModels()
validateApiKey(provider, key)
```

## API Routes

### Authentication Routes (`/api/auth`)
- `POST /register`: User registration
- `POST /login`: User authentication
- `POST /refresh-token`: Refresh access token

### Smart Prompts Routes (`/api/smart-prompts`)
- `GET /`: Get prompts with filtering and pagination
- `GET /:id`: Get a single prompt by ID
- `POST /`: Create a new prompt
- `PUT /:id`: Update an existing prompt
- `DELETE /:id`: Delete a prompt
- `POST /:id/rate`: Rate a prompt
- `POST /:id/like`: Toggle like on a prompt
- `POST /:id/save`: Toggle save on a prompt

### Provider API Keys Routes (`/api/provider-api-keys`)
- `GET /`: Get all configured API keys
- `POST /:provider`: Save/update provider API key
- `POST /:provider/test`: Test provider API key
- `PATCH /:provider/models/:model/toggle`: Toggle model availability

### Generate Prompt Route (`/api/generate-prompt`)
- `POST /`: Generate AI-powered prompts

## State Management

The Smart Prompts module uses a combination of React hooks and context for state management:

### Authentication Context
- User authentication state
- Token management
- Permission checking

### Smart Prompts Context
- Prompt listing state
- Filter management
- Pagination handling
- Cache management

### Settings Context
- API key management
- User preferences
- Theme settings
- Keyboard shortcuts

## Authentication & Security

### Security Features
- JWT-based authentication
- API key encryption
- Rate limiting
- Input validation
- XSS protection
- CORS configuration

### User Authentication Flow
1. Registration with email verification
2. JWT token generation
3. Refresh token rotation
4. Secure session management

## AI Integration

### Supported AI Providers
- OpenAI (GPT-3, GPT-4)
- Anthropic (Claude)
- Google (Gemini)
- Groq
- Mistral
- Azure OpenAI

### Integration Features
- Multiple model support
- API key management
- Model-specific settings
- Usage tracking
- Error handling
- Rate limit management

### Generation Parameters
- Temperature control
- Length settings
- Tone selection
- Prompt type customization
- Context management

## Social Features

### User Interactions
- Follow/Unfollow users
- Like/Save prompts
- Share prompts
- Comments and discussions
- User profiles

### Social Profile Features
- Bio and avatar
- Activity feed
- Prompt collections
- Statistics tracking
- Achievement system

## Database Schema

### SmartPrompt Schema
```javascript
{
  title: String,
  content: String,
  description: String,
  category: {
    type: String,
    enum: ['Content Creation', 'Technical', 'Business', 'Creative', 'Education', 'Other']
  },
  tags: [String],
  variables: [{
    name: String,
    description: String,
    defaultValue: String
  }],
  creator: ObjectId,
  visibility: {
    type: String,
    enum: ['private', 'public', 'shared']
  },
  aiModels: [String],
  stats: {
    uses: Number,
    shares: Number,
    averageRating: Number,
    totalRatings: Number
  },
  version: Number,
  parentPrompt: ObjectId,
  likes: [ObjectId],
  saves: [ObjectId]
}
```

### User Schema
```javascript
{
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin']
  },
  refreshToken: String,
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  favorites: [ObjectId],
  notificationSettings: {
    email: Boolean,
    push: Boolean
  },
  lastLoginAt: Date
}
```

## Configuration

### Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

### API Configuration
- Rate limiting settings
- CORS configuration
- Security headers
- Validation rules
- Cache settings

### Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`
4. Run tests: `npm test`

### Production Deployment
1. Build frontend: `npm run build`
2. Set production environment variables
3. Configure reverse proxy
4. Enable SSL/TLS
5. Set up monitoring

---

## Contributing
Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
