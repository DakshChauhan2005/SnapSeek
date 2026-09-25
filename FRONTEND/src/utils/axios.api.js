import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.err === "Device mismatch") {
      window.location.href = "/login"; // hard redirect clears all in-memory state cleanly
    }
    return Promise.reject(error);
  }
);


export default api;