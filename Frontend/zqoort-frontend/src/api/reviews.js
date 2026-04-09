import api from './axios';

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByUser: (userId) => api.get(`/reviews/user/${userId}`),
  getByRequest: (requestId) => api.get(`/reviews/request/${requestId}`),
};