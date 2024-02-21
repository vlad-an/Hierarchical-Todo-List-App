// src/services/authService.js

import axios from 'axios';

const API_URL = '/api/'; // Adjust this URL based on your API endpoint

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'login', {
        username,
        password,
      })
      .then((response) => {
        if (response.data.access_token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username, password) {
    return axios.post(API_URL + 'register', {
      username,
      password,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
