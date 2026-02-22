
import api from './axios.js';
import { env } from '../config/env.js';

export const webService = {
  get: (endpoint) => api.get(`${env.BASE_URL}${endpoint}`),
  post: (endpoint, data) => api.post(`${env.BASE_URL}${endpoint}`, data),
  put: (endpoint, data) => api.put(`${env.BASE_URL}${endpoint}`, data),
  delete: (endpoint) => api.delete(`${env.BASE_URL}${endpoint}`),
};
