import axios, { type AxiosResponse } from 'axios';
import { env } from './env';
import { useAuthStore } from '@/store/auth';
import { toast } from '@/hooks/use-toast';

const api = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast({
        title: "Authentication Error",
        description: "Please log in again",
        variant: "destructive",
      });
    } else if (error.response?.status >= 500) {
      toast({
        title: "Server Error",
        description: "The API is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
    
    return Promise.reject(error);
  }
);

export { api };
