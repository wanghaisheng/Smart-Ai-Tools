# Social Features Integration Guide

This guide explains how to integrate and use the social features in your Smart AI Tools application.

## 1. User Profiles

### Where to Add:
- Add a new route in your `App.jsx` or router configuration:
```jsx
import UserProfile from './components/social/UserProfile';

// In your router
<Route path="/users/:userId" element={<UserProfile />} />
```

### How to Use:
```jsx
// In any component where you want to link to a user's profile
import { Link } from 'react-router-dom';

<Link to={`/users/${userId}`}>View Profile</Link>
```

## 2. Comments & Ratings

### Where to Add:
- In your prompt detail view (`PromptDetails.jsx` or similar)
- Below the prompt content

### How to Use:
```jsx
import { CommentSection } from './components/social/CommentSection';

function PromptDetails({ promptId }) {
  return (
    <div>
      {/* Prompt content */}
      <CommentSection promptId={promptId} />
    </div>
  );
}
```

## 3. Following System

### Where to Add:
- User profile pages
- User listings
- Anywhere you display user information

### How to Use:
```jsx
import { useState } from 'react';
import { followUser, unfollowUser } from '../services/socialService';

function FollowButton({ userId }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outlined" : "contained"}
      onClick={handleFollow}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
```

## 4. API Integration

### Social Service Functions:
```javascript
// src/services/socialService.js

// Get user profile
export const getUserProfile = async (userId) => {
  const response = await fetch(`/api/social/profile/${userId}`);
  return response.json();
};

// Update profile
export const updateProfile = async (data) => {
  const response = await fetch('/api/social/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// Follow/Unfollow
export const followUser = async (userId) => {
  const response = await fetch(`/api/social/follow/${userId}`, {
    method: 'POST',
  });
  return response.json();
};

export const unfollowUser = async (userId) => {
  const response = await fetch(`/api/social/unfollow/${userId}`, {
    method: 'POST',
  });
  return response.json();
};

// Comments
export const addComment = async (promptId, content, rating) => {
  const response = await fetch(`/api/social/prompts/${promptId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, rating }),
  });
  return response.json();
};

export const getComments = async (promptId) => {
  const response = await fetch(`/api/social/prompts/${promptId}/comments`);
  return response.json();
};
```

## 5. Example Integration Points

1. **Smart Prompt Details Page**:
   - Add comments and ratings section
   - Show author profile with follow button
   - Display social stats (likes, comments)

2. **User Profile Page**:
   - Show user's prompts
   - Display followers/following counts
   - Add follow/unfollow button
   - Show user's activity

3. **Home/Feed Page**:
   - Add social feed of followed users' activities
   - Show trending prompts based on social interactions

4. **Navigation**:
   - Add profile link in header
   - Add notifications for social interactions

## 6. Required Components

1. Create these components in your project:
```
src/
  components/
    social/
      UserProfile.jsx       # User profile display
      CommentSection.jsx    # Comments and ratings
      FollowButton.jsx      # Follow/unfollow functionality
      SocialFeed.jsx        # Activity feed
      ProfileStats.jsx      # User statistics
```

## 7. State Management

Consider using a state management solution (Redux, Context API) for:
- Current user's profile
- Following status
- Social notifications
- Comment counts
- Rating averages

## Example Usage in Smart Prompts

```jsx
// src/pages/SmartPrompts/PromptDetails.jsx
import { CommentSection } from '../../components/social/CommentSection';
import { FollowButton } from '../../components/social/FollowButton';
import { ProfileStats } from '../../components/social/ProfileStats';

function PromptDetails({ promptId }) {
  return (
    <div className="prompt-details">
      {/* Prompt content */}
      <div className="author-section">
        <Link to={`/users/${authorId}`}>
          <Avatar src={authorAvatar} />
          <span>{authorName}</span>
        </Link>
        <FollowButton userId={authorId} />
        <ProfileStats userId={authorId} />
      </div>
      
      <CommentSection promptId={promptId} />
    </div>
  );
}
```

## 8. Styling Integration

Use Material-UI components for consistent styling:
```jsx
import {
  Avatar,
  Button,
  Card,
  Typography,
  Rating,
  TextField,
} from '@mui/material';
```

## 9. Error Handling

Always include error handling in your API calls:
```javascript
try {
  const result = await socialService.followUser(userId);
  // Handle success
} catch (error) {
  // Show error message to user
  console.error('Error:', error);
}
```

## 10. Authentication Integration

Ensure protected routes and actions require authentication:
```jsx
function ProtectedSocialFeature() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <YourSocialFeature />;
}
```
