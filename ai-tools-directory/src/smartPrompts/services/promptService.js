import axios from 'axios';
import { api } from '../../utils/api';

const BASE_URL = '/smart-prompts'; // Remove /api prefix since it's already in api.js

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getPrompts = async ({ page = 1, limit = 12, search = '', category = '', view = 'public', userId = null }) => {
  try {
    let queryParams = {
      page,
      limit,
      search,
      category,
    };

    // Handle different view types
    switch (view) {
      case 'my-prompts':
        if (!userId) return { prompts: [], totalPages: 0, totalCount: 0 };
        queryParams.userId = userId;
        break;
      case 'public':
        queryParams.visibility = 'public';
        break;
      case 'favorites':
        if (!userId) return { prompts: [], totalPages: 0, totalCount: 0 };
        queryParams.favorites = userId;
        break;
      case 'shared':
        if (!userId) return { prompts: [], totalPages: 0, totalCount: 0 };
        queryParams.sharedWith = userId;
        break;
      case 'all':
        if (userId) {
          // For authenticated users, show public ones and ones owned/shared with them
          queryParams.visibility = ['public', 'private', 'shared'];
          queryParams.accessibleBy = userId;
        } else {
          // For unauthenticated users, show only public prompts
          queryParams.visibility = 'public';
        }
        break;
      default:
        queryParams.visibility = 'public';
        break;
    }

    // Use the api instance that already has the baseURL and interceptors
    const response = await api.get('/smart-prompts', {
      params: queryParams
    });

    return {
      prompts: response.data.prompts || [],
      totalPages: response.data.totalPages || 1,
      totalCount: response.data.totalCount || 0
    };
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return { prompts: [], totalPages: 0, totalCount: 0 };
  }
};

const updatePromptsVisibility = async () => {
  try {
    const response = await api.post(`${BASE_URL}/update-visibility`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating prompts visibility:', error);
    throw error;
  }
};

export const promptService = {
  getPrompts,
  // Get a single prompt by ID
  async getPromptById(id) {
    try {
      const response = await api.get(`/smart-prompts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prompt:', error);
      throw error;
    }
  },

  // Create a new prompt
  async createPrompt(promptData) {
    try {
      const response = await api.post('/smart-prompts', promptData);
      return response.data;
    } catch (error) {
      console.error('Error creating prompt:', error);
      throw error;
    }
  },

  // Update an existing prompt
  async updatePrompt(id, promptData) {
    try {
      const response = await api.put(`/smart-prompts/${id}`, promptData);
      return response.data;
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
  },

  // Delete a prompt
  async deletePrompt(id) {
    try {
      await api.delete(`/smart-prompts/${id}`);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  },

  // Rate a prompt
  async ratePrompt(id, rating) {
    try {
      if (!localStorage.getItem('token')) {
        throw new Error('Authentication required to rate prompts');
      }
      const response = await api.post(`${BASE_URL}/${id}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error('Error rating prompt:', error);
      throw error;
    }
  },

  // Bulk import prompts
  async bulkImportPrompts(prompts) {
    try {
      // Ensure prompts is in the correct format
      const payload = Array.isArray(prompts) ? { prompts } : prompts;
      const response = await api.post(`${BASE_URL}/bulk`, payload);
      return response.data;
    } catch (error) {
      console.error('Error bulk importing prompts:', error);
      throw error;
    }
  },
  updatePromptsVisibility
};
