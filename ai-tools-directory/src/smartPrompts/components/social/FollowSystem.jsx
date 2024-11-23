import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const FollowSystem = ({ userId, initialFollowStatus = false }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFollowData();
  }, [userId]);

  const fetchFollowData = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        axios.get(`/api/social/followers/${userId}`),
        axios.get(`/api/social/following/${userId}`)
      ]);

      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
      
      // Check if current user is following
      if (user) {
        const followStatus = followersRes.data.some(follower => follower._id === user._id);
        setIsFollowing(followStatus);
      }
    } catch (error) {
      console.error('Error fetching follow data:', error);
      toast.error('Failed to load follow data');
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error('Please login to follow users');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/social/${isFollowing ? 'unfollow' : 'follow'}/${userId}`);
      setIsFollowing(!isFollowing);
      await fetchFollowData(); // Refresh follow data
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  const FollowButton = () => (
    <Button
      variant="contained"
      color={isFollowing ? "secondary" : "primary"}
      onClick={handleFollowToggle}
      disabled={loading || userId === user?._id}
      startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );

  const UserList = ({ users, title }) => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user._id}>
            <ListItemAvatar>
              <Avatar src={user.avatar} alt={user.username} />
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary={user.bio}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ my: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6">
          {followers.length} Followers · {following.length} Following
        </Typography>
        {user && user._id !== userId && <FollowButton />}
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <UserList users={followers} title="Followers" />
        <UserList users={following} title="Following" />
      </Box>
    </Box>
  );
};

export default FollowSystem;
