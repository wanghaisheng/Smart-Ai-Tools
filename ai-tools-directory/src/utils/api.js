import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Use relative URL for proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Add token to request if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      hasToken: !!config.headers.Authorization,
      token: token ? token.substring(0, 10) + '...' : null  // Log part of token for debugging
    });

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      hasData: !!response.data,
      hasToken: !!response.config.headers.Authorization
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
      hasToken: !!error.config?.headers?.Authorization
    });

    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Attempting token refresh...');
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Refreshing token...');
          const refreshResponse = await axios.post('/api/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (refreshResponse.data.token) {
            console.log('Token refresh successful');
            // Save the new token
            localStorage.setItem('token', refreshResponse.data.token);
            
            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            
            // Retry the original request
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

    return Promise.reject(error);
  }
);

// Export both default and named export for compatibility
export { api };
export default api;
