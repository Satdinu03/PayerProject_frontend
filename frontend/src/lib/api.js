import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (memberId, password) => 
    api.post('/auth/login', { memberId, password }),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  getAgentDashboard: () => 
    api.get('/auth/agent/dashboard'),
  
  getCustomerDashboard: () => 
    api.get('/auth/customer/dashboard'),
};

export default api;