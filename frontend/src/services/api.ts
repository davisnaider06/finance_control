import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

export default api;