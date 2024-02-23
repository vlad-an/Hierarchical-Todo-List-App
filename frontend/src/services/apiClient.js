// apiClient.js
import axios from 'axios';
import AuthService from './authService';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api',
});

apiClient.interceptors.request.use(config => {
  const token = AuthService.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
    (response) => response, // Simply return for successful responses
    async (error) => {
      const originalRequest = error.config;
      // Check if it's a token refresh error or if the retry flag is already set
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent multiple retries
        try {
          const access_token = await AuthService.refreshToken(); // Attempt to refresh token
          if (access_token) {
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
            return apiClient(originalRequest); // Retry the original request with the new token
          }
        } catch (refreshError) {
          return Promise.reject(refreshError); // Handle failed refresh (e.g., redirect to login)
        }
      }
      // For other errors, just return the promise rejection
      return Promise.reject(error);
    }
  );

export default apiClient;

