# Smart Prompts Module

This module provides a comprehensive prompt management system with advanced features and social interactions.

## Features

- **Prompt Management**
  - Create, read, update, and delete prompts
  - Rich text editing with variable support
  - Version history and tracking
  - Categories and tags for organization

- **Access Control**
  - Public, private, and shared visibility options
  - User-specific prompt collections
  - Collaborative prompt sharing

- **Search & Discovery**
  - Advanced search with filters
  - Category-based browsing
  - Tag-based organization
  - Popular and trending prompts

- **Social Features**
  - Rating system
  - Usage tracking
  - Favorite prompts
  - Share with other users

## Directory Structure

```
smartPrompts/
├── components/       # Reusable UI components
├── pages/           # Main page components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── services/        # API service functions
├── store/           # State management
└── types/           # TypeScript interfaces
```

## API Endpoints

### Public Endpoints

- `GET /api/smart-prompts`
  - Get prompts with filtering and pagination
  - Query params: page, limit, category, search, visibility

- `GET /api/smart-prompts/:id`
  - Get a single prompt by ID
  - Access control based on visibility

### Protected Endpoints (Requires Authentication)

- `POST /api/smart-prompts`
  - Create a new prompt
  - Required fields: title, content, description, category

- `PUT /api/smart-prompts/:id`
  - Update an existing prompt
  - Creator only

- `DELETE /api/smart-prompts/:id`
  - Delete a prompt
  - Creator only

- `POST /api/smart-prompts/:id/rate`
  - Rate a prompt
  - Rating range: 1-5

## Usage Examples

### Creating a Prompt

```javascript
const createPrompt = async (promptData) => {
  try {
    const response = await promptService.createPrompt({
      title: "My Smart Prompt",
      content: "Prompt content with {{variables}}",
      description: "A helpful description",
      category: "Technical",
      tags: ["coding", "ai"],
      visibility: "public"
    });
    return response.data;
  } catch (error) {
    console.error("Error creating prompt:", error);
  }
};
```

### Filtering Prompts

```javascript
const getFilteredPrompts = async () => {
  try {
    const response = await promptService.getPrompts({
      page: 1,
      limit: 12,
      category: "Technical",
      search: "coding",
      visibility: ["public", "shared"]
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching prompts:", error);
  }
};
```

## Components

### SmartPromptsPage
Main page component that handles:
- Prompt listing and filtering
- Tab navigation
- Category selection
- Search functionality

### PromptForm
Form component for:
- Creating new prompts
- Editing existing prompts
- Variable management
- Visibility controls

### PromptCard
Card component displaying:
- Prompt preview
- Rating
- Usage statistics
- Action buttons

## State Management

Uses React Context for:
- Authentication state
- User preferences
- Prompt collections
- Filter settings

## Styling

- Tailwind CSS for responsive design
- Dark theme support
- Mobile-first approach
- Framer Motion for animations

## Error Handling

- Comprehensive error messages
- Loading states
- Fallback UI components
- Network error recovery

## Best Practices

1. **Authentication**
   - Always check auth state before protected operations
   - Handle token expiration gracefully
   - Secure storage of credentials

2. **Performance**
   - Implement pagination
   - Lazy loading of components
   - Optimistic UI updates
   - Proper caching strategies

3. **UX/UI**
   - Responsive design
   - Loading indicators
   - Error messages
   - Success notifications

4. **Code Organization**
   - Modular components
   - Reusable hooks
   - Type safety
   - Clean code principles

## Contributing

1. Follow the existing code structure
2. Maintain type safety
3. Add proper documentation
4. Include tests for new features

## Future Improvements

- [ ] Advanced prompt templates
- [ ] AI-powered suggestions
- [ ] Collaborative editing
- [ ] Analytics dashboard
- [ ] Export/Import functionality
- [ ] Integration with other AI models
