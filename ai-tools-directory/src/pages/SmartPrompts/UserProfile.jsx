import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Tab,
  Tabs,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import PromptCard from '../../smartPrompts/components/PromptCard';
import FollowSystem from '../../smartPrompts/components/social/FollowSystem';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (profile) {
      fetchUserContent();
    }
  }, [profile, activeTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContent = async () => {
    try {
      let endpoint = `/api/smart-prompts/user/${userId}`;
      
      switch (activeTab) {
        case 0: // Prompts
          endpoint = `/api/smart-prompts/user/${userId}`;
          break;
        case 1: // Liked
          endpoint = `/api/smart-prompts/user/${userId}/liked`;
          break;
        case 2: // Saved
          endpoint = `/api/smart-prompts/user/${userId}/saved`;
          break;
        default:
          break;
      }

      const response = await axios.get(endpoint);
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching user content:', error);
      toast.error('Failed to load user content');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Typography variant="h6">User not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
          <Avatar
            src={profile.avatar}
            alt={profile.name}
            sx={{ width: 120, height: 120, mr: 3 }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" component="h1">
                  {profile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              {user && user._id !== userId && (
                <FollowSystem userId={userId} />
              )}
            </Box>
            
            {profile.bio && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                {profile.bio}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Typography variant="body2">
                <strong>{profile.promptCount}</strong> prompts
              </Typography>
              <Typography variant="body2">
                <strong>{profile.followers.length}</strong> followers
              </Typography>
              <Typography variant="body2">
                <strong>{profile.following.length}</strong> following
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Prompts" />
          <Tab label="Liked" />
          <Tab label="Saved" />
        </Tabs>

        <Grid container spacing={3}>
          {prompts.map((prompt) => (
            <Grid item xs={12} sm={6} md={4} key={prompt._id}>
              <PromptCard
                prompt={prompt}
                onUpdate={fetchUserContent}
              />
            </Grid>
          ))}
          {prompts.length === 0 && (
            <Box sx={{ py: 4, width: '100%', textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {activeTab === 0
                  ? 'No prompts created yet'
                  : activeTab === 1
                  ? 'No liked prompts'
                  : 'No saved prompts'}
              </Typography>
            </Box>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;
