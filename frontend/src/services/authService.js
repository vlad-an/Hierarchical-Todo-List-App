// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000/api/';

const register = (username, password) => {
  return axios.post(API_URL + 'register', { username, password });
};

const login = (username, password) => {
  return axios.post(API_URL + 'login', { username, password })
    .then((response) => {
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getAuthToken = () => {
  const user = getCurrentUser();
  return user ? user.access_token : null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthToken, // Make sure this is correctly exported
};

