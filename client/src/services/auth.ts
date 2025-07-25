import { api } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },

  async getMe(): Promise<AuthResponse['user']> {
    const response = await api.get<AuthResponse['user']>('/me');
    return response.data;
  },

  async logout(): Promise<void> {
    // Limpa o token do localStorage
    localStorage.removeItem('auth');
  },
};
