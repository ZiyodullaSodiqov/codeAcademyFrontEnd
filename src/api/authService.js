import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5055';

const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (username, password) => {
  const response = await api.post('/api/login', { username, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/api/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};