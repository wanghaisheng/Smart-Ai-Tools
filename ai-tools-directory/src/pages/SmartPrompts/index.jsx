import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  TextField,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import PromptCard from '../../smartPrompts/components/PromptCard';
import toast from 'react-hot-toast';

const SmartPrompts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState('latest');

  useEffect(() => {
    fetchPrompts();
  }, [activeTab, filter]);

  const fetchPrompts = async () => {
    try {
      let endpoint = '/api/smart-prompts';
      
      switch (activeTab) {
        case 1: // Following
          if (!user) {
            setPrompts([]);
            setLoading(false);
            return;
          }
          endpoint = '/api/smart-prompts/following';
          break;
        case 2: // Popular
          endpoint = '/api/smart-prompts/popular';
          break;
        default: // Latest
          break;
      }

      const response = await axios.get(`${endpoint}?filter=${filter}`);
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePrompt = () => {
    navigate('/smart-prompts/create');
  };

  const handlePromptClick = (promptId) => {
    navigate(`/smart-prompts/${promptId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Smart Prompts
        </Typography>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePrompt}
          >
            Create Prompt
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Latest" />
          <Tab label="Following" />
          <Tab label="Popular" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPrompts.map((prompt) => (
            <Grid item xs={12} sm={6} md={4} key={prompt._id}>
              <PromptCard
                prompt={prompt}
                onClick={() => handlePromptClick(prompt._id)}
                onUpdate={fetchPrompts}
              />
            </Grid>
          ))}
          {filteredPrompts.length === 0 && (
            <Box sx={{ py: 4, width: '100%', textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery
                  ? 'No prompts found matching your search'
                  : activeTab === 1 && !user
                  ? 'Please login to see prompts from users you follow'
                  : 'No prompts available'}
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default SmartPrompts;
