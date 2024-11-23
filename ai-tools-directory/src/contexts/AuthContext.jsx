import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error.response?.data || error.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('AuthContext: Login attempt started', {
      emailLength: email.length,
      passwordLength: password.length,
      passwordChars: password.split('').map(c => c.charCodeAt(0))
    });

    try {
      console.log('AuthContext: Making login API request...');
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password
      });
      
      console.log('AuthContext: Received login response:', { 
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user 
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('AuthContext: Login error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (username, email, password) => {
    console.log('Registration attempt for email:', email);
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setError('');
      console.log('Registration successful for user:', userData.username);
      toast.success('Registration successful! Welcome to AI Tools Directory!');
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      console.error('Registration failed:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log('User logging out:', user?.username);
    localStorage.removeItem('token');
    setUser(null);
    setError('');
    toast.info('You have been logged out');
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
