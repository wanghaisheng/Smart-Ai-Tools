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

### Prompt Routes
```
GET    /api/smart-prompts
POST   /api/smart-prompts
GET    /api/smart-prompts/:id
PUT    /api/smart-prompts/:id
DELETE /api/smart-prompts/:id

// Social interactions
POST   /api/smart-prompts/:id/like
POST   /api/smart-prompts/:id/save
POST   /api/smart-prompts/:id/share
POST   /api/smart-prompts/:id/rate
```

### User Routes
```
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/:id/prompts
POST   /api/users/follow
DELETE /api/users/follow
```

### AI Routes
```
POST   /api/ai/generate
GET    /api/ai/models
POST   /api/ai/validate-key
```

## State Management

### Authentication Context
- User authentication state
- Token management
- Permission checking

### Prompt Context
- Current prompt state
- Filter state
- Pagination state

## Authentication & Security

### Features
- JWT-based authentication
- Role-based access control
- API key encryption
- Rate limiting

### Implementation
```javascript
// Token management
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  return !loading && user ? children : <Navigate to="/login" />;
};
```

## AI Integration

### Supported Models
- GPT-4/3.5 (OpenAI)
- Claude (Anthropic)
- Gemini (Google)
- Mixtral (Mistral)
- Custom models (via API)

### Integration Flow
1. API key validation
2. Model selection
3. Parameter configuration
4. Generation request
5. Response processing
6. Result formatting

## Social Features

### Functionality
- Following system
- Like/Save system
- Sharing capabilities
- Comments & discussions
- User profiles
- Activity feed

### Implementation Details
- Real-time updates
- Optimistic updates
- Cached responses
- Pagination support

## Database Schema

### Prompt Schema
```javascript
{
  id: ObjectId,
  title: String,
  content: String,
  variables: Array,
  creator: ObjectId,
  visibility: String,
  category: String,
  tags: Array,
  likes: Array,
  saves: Array,
  ratings: Array,
  comments: Array,
  version: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema
```javascript
{
  id: ObjectId,
  username: String,
  email: String,
  profile: Object,
  prompts: Array,
  favorites: Array,
  following: Array,
  followers: Array,
  settings: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Configuration

### Environment Variables
```env
# API Configuration
API_BASE_URL=
API_VERSION=

# Authentication
JWT_SECRET=
JWT_EXPIRY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
AZURE_API_KEY=

# Database
MONGODB_URI=
REDIS_URL=

# Features
ENABLE_SOCIAL=
ENABLE_AI=
MAX_PROMPTS_PER_USER=
```

### Feature Flags
- `ENABLE_SOCIAL`: Toggle social features
- `ENABLE_AI`: Toggle AI integration
- `ENABLE_COMMENTS`: Toggle comment system
- `ENABLE_SHARING`: Toggle sharing features

---

## Contributing
Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
