import axios from 'axios';
import { getStoredToken, supabase } from './supabaseClient';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle global API errors (like Invalid Token / 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid or expired, log the user out
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or invalid token detected. Logging out.');
      supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Named API helpers
export const tripsAPI = {
  getAll:  ()     => api.get('/trips'),
  getById: (id)   => api.get(`/trips/${id}`),
  create:  (data) => api.post('/trips', data),
  update:  (id, data) => api.put(`/trips/${id}`, data),
  delete:         (id)   => api.delete(`/trips/${id}`),
  copy:           (id)   => api.post(`/trips/${id}/copy`),
  getPackingList: (id)   => api.get(`/trips/${id}/packing-list`),
};

export const stopsAPI = {
  create:      (data)       => api.post('/stops', data),
  delete:      (id)         => api.delete(`/stops/${id}`),
  addActivity: (stopId, d)  => api.post(`/stops/${stopId}/activities`, d),
};

export default api;