import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5055/api';

const getProblems = async () => {
  try {
    const response = await axios.get(`${API_URL}/problems`);
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

const getProblemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/problems/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching problem:', error);
    return null;
  }
};

export default {
  getProblems,
  getProblemById
};