import apiClient from './apiClient'; // Ensure you have this for direct API calls

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000/api/';

const authService = {
  // Register User
  register: async (username, password) => {
    const response = await apiClient.post(API_URL + 'register', {
      username,
      password,
    });
    return response.data;
  },

  // Login User
  login: async (username, password) => {
    const response = await apiClient.post('/login', {
      username,
      password,
    });
    if (response.data.access_token && response.data.refresh_token) {
      localStorage.setItem('user', JSON.stringify({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token
      }));
    }
    return response.data;
  },

  refreshToken: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.refresh_token) return null;

    try {
      const response = await apiClient.post('/token/refresh', {
        refresh_token: user.refresh_token
      });
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify({
          ...user,
          access_token: response.data.access_token
        }));
        return response.data.access_token;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },

  // Logout User
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get Current User
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Get Auth Token
  getAuthToken: () => {
    const user = authService.getCurrentUser();
    return user?.access_token || null;
  },
};

export default authService;


