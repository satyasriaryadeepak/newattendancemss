import axios from 'axios';

// Use environment variable for API URL in production, default to localhost for development
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => api.post('/auth/login', data);
export const initAdmin = () => api.post('/auth/init-admin');

export const getEmployees = () => api.get('/admin/employees');
export const createEmployee = (data) => api.post('/admin/employees', data);
export const deleteEmployee = (id) => api.delete(`/admin/employees/${id}`);
export const getStats = () => api.get('/admin/stats');
export const getReports = (date) => api.get(`/admin/reports?date=${date}`);

export const getAttendanceStatus = () => api.get('/attendance/status');
export const checkIn = () => api.post('/attendance/check-in');
export const checkOut = () => api.post('/attendance/check-out');

export default api;
