import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [prompts, setPrompts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPrompts();
    fetchFollowers();
    fetchFollowing();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserPrompts = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/prompts`);
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error('Error fetching user prompts:', error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/followers`);
      const data = await response.json();
      setFollowers(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/following`);
      const data = await response.json();
      setFollowing(data);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchFollowers();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (!profile) return null;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={profile.avatar}
                sx={{ width: 120, height: 120 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4">{profile.name}</Typography>
              <Typography color="text.secondary" gutterBottom>
                @{profile.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.bio}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2">
                  <strong>{followers.length}</strong> Followers
                </Typography>
                <Typography variant="body2">
                  <strong>{following.length}</strong> Following
                </Typography>
                <Typography variant="body2">
                  <strong>{prompts.length}</strong> Prompts
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              {profile.isCurrentUser ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => {/* Handle edit profile */}}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleFollow}
                >
                  {profile.isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Prompts" />
        <Tab label="Followers" />
        <Tab label="Following" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {prompts.map((prompt) => (
            <Grid item xs={12} sm={6} md={4} key={prompt.id}>
              {/* Render PromptCard component */}
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={2}>
          {followers.map((follower) => (
            <Grid item xs={12} sm={6} md={4} key={follower.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={follower.avatar} />
                  <Box>
                    <Typography variant="subtitle1">{follower.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{follower.username}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={2}>
          {following.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={user.avatar} />
                  <Box>
                    <Typography variant="subtitle1">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserProfile;
