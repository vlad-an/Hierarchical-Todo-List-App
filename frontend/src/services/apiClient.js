import axios from 'axios';
import AuthService from './authService';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api',
});

// Intercept all requests to add the auth token
apiClient.interceptors.request.use(config => {
    const authToken = AuthService.getAuthToken();
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
