import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', headers: { 'Content-Type': 'application/json' }, timeout: 10000 });

api.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((res) => res.data, (err) => { if (err.response?.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; } return Promise.reject(err); });

export const apiService = { get: (url, cfg) => api.get(url, cfg), post: (url, data, cfg) => api.post(url, data, cfg), put: (url, data, cfg) => api.put(url, data, cfg), patch: (url, data, cfg) => api.patch(url, data, cfg), delete: (url, cfg) => api.delete(url, cfg) };
export default api;