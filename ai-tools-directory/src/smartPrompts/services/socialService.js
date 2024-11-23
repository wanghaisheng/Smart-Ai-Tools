// Social interaction service functions

export const fetchUserProfile = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
};

export const followUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}/follow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to follow user');
  return response.json();
};

export const unfollowUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}/unfollow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to unfollow user');
  return response.json();
};

export const getFollowers = async (userId) => {
  const response = await fetch(`/api/users/${userId}/followers`);
  if (!response.ok) throw new Error('Failed to fetch followers');
  return response.json();
};

export const getFollowing = async (userId) => {
  const response = await fetch(`/api/users/${userId}/following`);
  if (!response.ok) throw new Error('Failed to fetch following');
  return response.json();
};

export const addComment = async (promptId, content, rating) => {
  const response = await fetch(`/api/smart-prompts/${promptId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, rating }),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};

export const getComments = async (promptId) => {
  const response = await fetch(`/api/smart-prompts/${promptId}/comments`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};
