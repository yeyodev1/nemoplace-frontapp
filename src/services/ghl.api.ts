import axios from 'axios';

const api = axios.create({
  baseURL: '/api/ghl',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token (si aplica, usualmente se hace globalmente pero por simplicidad se puede agregar)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ghlApi = {
  saveIntegration(workspaceId: string, locationId: string, apiKey: string) {
    return api.post('/integration', { workspaceId, locationId, apiKey });
  },

  removeIntegration(workspaceId: string) {
    return api.post('/integration/remove', { workspaceId });
  },

  getAdLeads(workspaceId: string, query?: string) {
    return api.get(`/${workspaceId}/leads`, { params: { query } });
  }
};
