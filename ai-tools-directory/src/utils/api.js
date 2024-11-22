import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',  // Use relative URL for proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const token = localStorage.getItem('token');
        if (token) {
          const refreshResponse = await axios.post('/api/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (refreshResponse.data.token) {
            // Save the new token
            localStorage.setItem('token', refreshResponse.data.token);
            
            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            
            // Retry the original request with the configured api instance
            return api(originalRequest);
          }
        }
        
        // If refresh failed or no token exists, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Also export as default for backward compatibility
export default api;
