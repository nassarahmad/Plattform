import api from './axios';

export const badgeAPI = {
  getAll: () => api.get('/badges/available'),
  getUserBadges: (userId) => api.get(`/badges/user/${userId}`),
};