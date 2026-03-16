import { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

import axios from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

// Function to get token from localStorage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const parsed = JSON.parse(userData);
    return parsed.accessToken;
  } catch (e) {
    console.error('Failed to parse localStorage userData:', e);
    return null;
  }
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Axios] Added Authorization header with token');
  } else {
    console.log('[Axios] No token found in localStorage');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[Axios] Got 401, attempting to refresh token...');

      try {
        // Create axios instance without interceptors for refresh call
        const plainAxios = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
          withCredentials: true,
        });

        // Get current token
        const token = getToken();
        console.log('[Axios] Current token:', token ? `${token.substring(0, 20)}...` : 'none');

        const refreshRes = await plainAxios.post(
          '/auth/refresh',
          {},
          { 
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );
        
        const { access_token } = refreshRes.data;
        console.log('[Axios] Refresh response:', access_token ? `${access_token.substring(0, 20)}...` : 'empty');
        
        // Update token in localStorage
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            parsed.accessToken = access_token;
            localStorage.setItem('userData', JSON.stringify(parsed));
            console.log('[Axios] Token refreshed and stored');
          }
        }
        
        // Update the failed request header with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        console.log('[Axios] Retrying original request with new token');
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.log('[Axios] Token refresh failed:', (refreshError as any).message);
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
