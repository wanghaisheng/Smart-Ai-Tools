import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Tab, Tabs, Paper, Grid, Button } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import FollowSystem from './FollowSystem';
import PromptCard from '../PromptCard';
import toast from 'react-hot-toast';

const UserProfile = ({ userId }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const [profileRes, promptsRes] = await Promise.all([
        axios.get(`/api/users/${userId}/profile`),
        axios.get(`/api/smart-prompts/user/${userId}`)
      ]);

      setProfile(profileRes.data);
      setPrompts(promptsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Loading...</Box>;
  }

  if (!profile) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>User not found</Box>;
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={profile.avatar}
            alt={profile.username}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4">{profile.username}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {profile.bio}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        <FollowSystem userId={userId} />
      </Paper>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`Prompts (${prompts.length})`} />
        <Tab label="Activity" />
        <Tab label="Liked Prompts" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {prompts.map((prompt) => (
            <Grid item xs={12} sm={6} md={4} key={prompt._id}>
              <PromptCard prompt={prompt} onUpdate={fetchUserData} />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Recent activity will be shown here...
          </Typography>
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Liked prompts will be shown here...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
