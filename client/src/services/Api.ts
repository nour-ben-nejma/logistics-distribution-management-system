// src/services/Api.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Get API URL from environment variables or use local default
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

// Ensure the URL ends with /api if not already present
const baseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request Interceptor to add Authorization token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${baseURL}/refresh-token`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          
          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Legacy Helper Functions
export const getInternalDepots = async (params?: any) => {
  const response = await api.get('/getInternalDepots', { params });
  return response.data;
};

export const addInternalDepot = async (depotData: any) => {
  const response = await api.post('/addInternalDepot', depotData);
  return response.data;
};

export const updateInternalDepot = async (id: string | number, depotData: any) => {
  const response = await api.put(`/updateInternalDepot/${id}`, depotData);
  return response.data;
};

export const deleteInternalDepot = async (id: string | number) => {
  const response = await api.delete(`/deleteInternalDepot/${id}`);
  return response.data;
};
