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
    const response = await apiClient.post(API_URL + 'login', {
      username,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
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


