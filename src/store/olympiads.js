// olympiads.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5055', // Backend URL
});

const olympiadService = {
  fetchOlympiadById: async (olympiadId) => {
    return axiosInstance.get(`/api/olympiads/${olympiadId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  },

  getOlympiadProblems: async (olympiadId) => {
    return axiosInstance.get(`/api/olympiads/${olympiadId}/problems`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  },

  submitSolution: async (olympiadId, submissionData) => {
    return axiosInstance.post(`/api/olympiads/${olympiadId}/submit`, submissionData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  },
};

export default olympiadService;