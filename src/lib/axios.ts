import { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

import axios from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Access token from cookie if needed (middleware handles mostly)
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post('/auth/refresh');
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
