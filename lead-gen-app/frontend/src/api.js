import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lead operations
export const leadAPI = {
  // Get all leads
  getAll: () => api.get('/leads'),
  
  // Get single lead
  getById: (id) => api.get(`/leads/${id}`),
  
  // Create new lead
  create: (leadData) => api.post('/leads', leadData),
  
  // Update lead
  update: (id, updates) => api.put(`/leads/${id}`, updates),
  
  // Delete lead
  delete: (id) => api.delete(`/leads/${id}`),
  
  // Get statistics
  getStats: () => api.get('/stats'),
};

export default api;
