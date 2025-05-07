import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5055/api';

export default {
  getOlympiads: async () => {
    try {
      const response = await axios.get(`${API_URL}/olympiads`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching olympiads:', error);
      return { data: [] };
    }
  },
  
  getLeaderboard: async (olympiadId) => {
    try {
      const response = await axios.get(`${API_URL}/olympiads/${olympiadId}/leaderboard`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return { data: [] };
    }
  },

  fetchOlympiadById: async (olympiad_id) => {
    try {
      const response = await axios.get(`${API_URL}/olympiads/${olympiad_id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching olympiad:', error);
      if (error.response?.status === 404) {
        throw new Error('Olympiad not found');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch olympiad');
    }
  },

  fetchProblemById: async (problem_id) => {
    try {
      const response = await axios.get(`${API_URL}/problems/${problem_id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching problem:', error);
      if (error.response?.status === 404) {
        throw new Error('Problem not found');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch problem');
    }
  },

  getOlympiadProblems: async (olympiad_id) => {
    try {
      const response = await axios.get(`${API_URL}/olympiads/${olympiad_id}/problems`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching olympiad problems:', error);
      return { data: [] };
    }
  },

  submitSolution: async (problem_id, submissionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/problems/${problem_id}/submit`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { data: response.data };
    } catch (error) {
      console.error('Error submitting solution:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error(error.response?.data?.error || 'Submission failed');
    }
  }
};