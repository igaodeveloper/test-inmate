import axios from 'axios';
import { env } from '@/lib/env';
import { useAuthStore } from '@/store/auth';

const api = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para adicionar o token de autenticação
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

// Response interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Se receber 401, desloga o usuário
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export { api };
