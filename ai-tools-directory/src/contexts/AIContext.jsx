import { createContext, useContext, useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

const AIContext = createContext();

export function AIProvider({ children }) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch personalized recommendations
  const fetchRecommendations = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await aiService.getPersonalizedRecommendations(user.id);
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Get chatbot response
  const getChatResponse = useCallback(async (message) => {
    setIsLoading(true);
    try {
      const response = await aiService.getChatbotResponse(message, {
        userId: user?.id,
        previousMessages: chatHistory
      });
      const newMessage = { role: 'assistant', content: response.message };
      setChatHistory(prev => [...prev, { role: 'user', content: message }, newMessage]);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, chatHistory]);

  // Natural language search
  const searchTools = useCallback(async (query) => {
    setIsLoading(true);
    try {
      const results = await aiService.searchTools(query);
      return results;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Compare tools
  const compareTools = useCallback(async (toolIds) => {
    setIsLoading(true);
    try {
      const comparison = await aiService.getToolComparison(toolIds);
      return comparison;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    recommendations,
    chatHistory,
    isLoading,
    error,
    fetchRecommendations,
    getChatResponse,
    searchTools,
    compareTools,
    clearError: () => setError(null),
    clearChatHistory: () => setChatHistory([])
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
