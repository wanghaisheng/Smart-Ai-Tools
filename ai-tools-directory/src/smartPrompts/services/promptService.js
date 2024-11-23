import axios from 'axios';

const API_URL = '/api/smart-prompts';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const promptService = {
  // Get all public prompts with optional filters
  async getPrompts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_URL}?${queryString}`);
    return response.data;
  },

  // Get a single prompt by ID
  async getPromptById(id) {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Create a new prompt
  async createPrompt(promptData) {
    const response = await axios.post(API_URL, promptData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Update a prompt
  async updatePrompt(id, promptData) {
    const response = await axios.put(`${API_URL}/${id}`, promptData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Delete a prompt
  async deletePrompt(id) {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Rate a prompt
  async ratePrompt(id, rating) {
    const response = await axios.post(
      `${API_URL}/${id}/rate`,
      { rating },
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};
