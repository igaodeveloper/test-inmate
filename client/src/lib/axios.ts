import axios, { type AxiosResponse } from 'axios';
import { env } from './env';
import { useAuthStore } from '@/store/auth';
import { toast } from '@/hooks/use-toast';

const isProduction = process.env.NODE_ENV === 'production';
const isRenderApi = env.API_BASE_URL.includes('render.com');

// Increase timeout for Render's free tier which can be slow to start
const API_TIMEOUT = 30000; // 30 seconds

const api = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json',
  },
  // Only enable withCredentials in production when using the render.com API
  withCredentials: isProduction && isRenderApi,
  timeout: API_TIMEOUT,
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
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data ? JSON.parse(error.config.data) : null,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
    };

    console.error('API Error:', errorDetails);

    // Default error message
    let errorMessage = 'An unexpected error occurred';
    let errorTitle = 'Error';

    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      errorTitle = 'Request Timeout';
      errorMessage = 'The request took too long. Please check your connection and try again.';
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      if (status === 401) {
        errorTitle = 'Session Expired';
        errorMessage = 'Your session has expired. Please log in again.';
        useAuthStore.getState().logout();
      } else if (status >= 500) {
        errorTitle = 'Server Error';
        errorMessage = 'The server encountered an error. Please try again later.';
        
        // Add more specific error messages if available
        if (data && typeof data === 'object') {
          if (data.message) errorMessage = data.message;
          if (data.error) errorMessage = data.error;
        }
        
        // Add status code to error message
        errorMessage += ` (Error ${status})`;
      } else if (status === 400) {
        errorTitle = 'Invalid Request';
        if (data && data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = 'Please check your input and try again.';
        }
      } else if (status === 404) {
        errorTitle = 'Not Found';
        errorMessage = 'The requested resource was not found.';
      } else if (status === 429) {
        errorTitle = 'Too Many Requests';
        errorMessage = 'You have made too many requests. Please try again later.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorTitle = 'Network Error';
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    }

    // Show error toast
    toast({
      title: errorTitle,
      description: errorMessage,
      variant: 'destructive',
    });

    return Promise.reject(error);
  }
);

export { api };
