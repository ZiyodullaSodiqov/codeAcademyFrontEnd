import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5055';

export const fetchProblems = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/problems`);
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error.response?.data || { error: 'Failed to fetch problems' };
  }
};

export const fetchProblemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/problems/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching problem:', error);
    throw error.response?.data || { error: 'Failed to fetch problem' };
  }
};

export const submitSolution = async (problemId, { language, code }) => {
    try {
      const response = await axios.post(`${API_URL}/api/problems/${problemId}/submit`, {
        language,
        code,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Submission failed');
    }
  };