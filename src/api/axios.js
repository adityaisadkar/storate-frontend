import axios from 'axios';

const API = axios.create({
  // Use the Render URL for production, localhost for development
  baseURL: import.meta.env.VITE_API_URL || 'https://storate-backend.onrender.com/api',
});

// Add a request interceptor to include JWT token
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;
