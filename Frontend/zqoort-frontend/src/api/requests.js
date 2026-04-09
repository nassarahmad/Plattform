/* import api from './axios';

export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  getNearby: (lng, lat, maxDistance = 15000) => 
    api.get(`/requests/nearby`, { params: { lng, lat, maxDistance } }),
  accept: (id) => api.patch(`/requests/${id}/accept`),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
  delete: (id) => api.delete(`/requests/${id}`),
}; */

import api from './axios';
export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getNearby: (lng, lat, maxDistance = 15000) => 
    api.get(`/requests/nearby`, { params: { lng, lat, maxDistance } }),
  accept: (id) => api.patch(`/requests/${id}/accept`),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
};