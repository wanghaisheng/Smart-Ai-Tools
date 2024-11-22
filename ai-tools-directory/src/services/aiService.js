import api from '../utils/api';

export const aiService = {
  // Get personalized tool recommendations based on user behavior
  async getPersonalizedRecommendations(userId) {
    try {
      const response = await api.get(`/ai/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  // Get tool recommendations based on collaborative filtering
  async getCollaborativeRecommendations(toolId) {
    try {
      const response = await api.get(`/ai/collaborative/${toolId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborative recommendations:', error);
      throw error;
    }
  },

  // Get AI-powered tool comparisons
  async getToolComparison(toolIds) {
    try {
      const response = await api.post('/ai/compare-tools', { toolIds });
      return response.data;
    } catch (error) {
      console.error('Error comparing tools:', error);
      throw error;
    }
  },

  // Get chatbot response
  async getChatbotResponse(message, context) {
    try {
      const response = await api.post('/ai/chat', { message, context });
      return response.data;
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      throw error;
    }
  },

  // Natural language search
  async searchTools(query) {
    try {
      const response = await api.post('/ai/search', { query });
      return response.data;
    } catch (error) {
      console.error('Error searching tools:', error);
      throw error;
    }
  },

  // Get usage scenario suggestions
  async getScenarioSuggestions(requirements) {
    try {
      const response = await api.post('/ai/scenarios', { requirements });
      return response.data;
    } catch (error) {
      console.error('Error getting scenario suggestions:', error);
      throw error;
    }
  }
}
