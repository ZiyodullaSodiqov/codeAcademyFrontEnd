import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5055';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/register`, userData);
  return response.data;
};

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/api/login`, {
    username,
    password,
  });
  return response.data;
};

const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/api/me`, config);
  return response.data;
};

export default {
  register,
  login,
  getMe,
};