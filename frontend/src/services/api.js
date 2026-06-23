import axios from 'axios';

const isProduction = import.meta.env.PROD;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? '/api' : 'http://localhost:5000/api'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — unwrap .data and surface errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Preserve the original error response so components can use it
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.errors?.join(', ') ||
      err.message ||
      'An unknown error occurred.';
    const enhancedError = new Error(message);
    enhancedError.response = err.response;
    return Promise.reject(enhancedError);
  }
);

// ── Goals ──────────────────────────────────────────────────────────
export const getGoals        = () => api.get('/goals').then(r => r.data.data);
export const getGoal         = (id) => api.get(`/goals/${id}`).then(r => r.data.data);
export const createGoal      = (data) => api.post('/goals', data).then(r => r.data.data);
export const updateGoal      = (id, data) => api.put(`/goals/${id}`, data).then(r => r.data.data);
export const deleteGoal      = (id) => api.delete(`/goals/${id}`).then(r => r.data);
export const getStats        = () => api.get('/goals/stats').then(r => r.data.data);

// ── Progress ───────────────────────────────────────────────────────
export const getProgress     = (goalId) =>
  api.get('/progress', { params: goalId ? { goal_id: goalId } : {} }).then(r => r.data.data);
export const createProgress  = (data) => api.post('/progress', data).then(r => r.data.data);
export const updateProgress  = (id, data) => api.put(`/progress/${id}`, data).then(r => r.data.data);
export const deleteProgress  = (id) => api.delete(`/progress/${id}`).then(r => r.data);
export const getHeatmap      = () => api.get('/progress/heatmap').then(r => r.data.data);

export default api;
