
import api from './axios.js';
import { env } from '../config/env.js';

export const webService = {
  get: (endpoint, options = {}) => api.get(`${env.BASE_URL}${endpoint}`, options),
  post: (endpoint, data, options = {}) => api.post(`${env.BASE_URL}${endpoint}`, data, options),
  put: (endpoint, data, options = {}) => api.put(`${env.BASE_URL}${endpoint}`, data, options),
  delete: (endpoint, options = {}) => api.delete(`${env.BASE_URL}${endpoint}`, options),
};
