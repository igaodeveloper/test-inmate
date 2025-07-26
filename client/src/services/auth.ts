import { api } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cards?: Card[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ userId: string }> {
    const response = await api.post<{ userId: string }>('/register', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth');
  },
};

export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}
