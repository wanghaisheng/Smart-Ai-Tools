import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export function useFavorites() {
  const { isAuthenticated, user } = useAuth();
  const [favoriteTools, setFavoriteTools] = useState(new Map());

  const checkFavoriteStatus = useCallback(async (toolId) => {
    if (!isAuthenticated) return { isFavorited: false, favoriteCount: 0 };
    try {
      const response = await api.get(`/favorites/check/${toolId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoriteTools(prev => new Map(prev).set(toolId, response.data));
      return response.data;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return { isFavorited: false, favoriteCount: 0 };
    }
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(async (toolId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return null;
    }

    try {
      const response = await api.post(`/favorites/toggle/${toolId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoriteTools(prev => new Map(prev).set(toolId, response.data));
      
      toast.success(response.data.isFavorited 
        ? 'Added to favorites!' 
        : 'Removed from favorites'
      );
      
      return response.data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error updating favorites');
      return null;
    }
  }, [isAuthenticated]);

  const getFavoriteTools = useCallback(async () => {
    if (!isAuthenticated) return [];
    try {
      const response = await api.get('/favorites/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite tools:', error);
      toast.error('Error fetching favorites');
      return [];
    }
  }, [isAuthenticated]);

  return {
    favoriteTools,
    checkFavoriteStatus,
    toggleFavorite,
    getFavoriteTools,
  };
}
