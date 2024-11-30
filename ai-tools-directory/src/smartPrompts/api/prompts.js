import axios from 'axios';

const API_URL = '/api/prompts';

// Save a modified version of a prompt
export const saveModifiedPrompt = async (promptId, data) => {
  try {
    const response = await axios.post(`${API_URL}/${promptId}/save-modified`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
