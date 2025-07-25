import { api } from './api';
import { Card } from './cards';

export interface Trade {
  id: number;
  creatorId: number;
  status: 'open' | 'pending' | 'completed' | 'cancelled';
  description?: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: number;
    username: string;
    email: string;
  };
  offeringCards: Card[];
  receivingCards: Card[];
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    rpp: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTradeData {
  offeringCards: number[];
  receivingCards: number[];
  description?: string;
}

export const tradesService = {
  async getAllTrades(page: number = 1, rpp: number = 10) {
    const response = await api.get<PaginatedResponse<Trade>>('/trades', {
      params: { page, rpp },
    });
    return response.data;
  },

  async getUserTrades(page: number = 1, rpp: number = 10) {
    const response = await api.get<PaginatedResponse<Trade>>('/me/trades', {
      params: { page, rpp },
    });
    return response.data;
  },

  async getTradeById(id: number): Promise<Trade> {
    const response = await api.get<Trade>(`/trades/${id}`);
    return response.data;
  },

  async createTrade(data: CreateTradeData): Promise<Trade> {
    const response = await api.post<Trade>('/trades', data);
    return response.data;
  },

  async deleteTrade(id: number): Promise<void> {
    await api.delete(`/trades/${id}`);
  },

  async cancelTrade(id: number): Promise<Trade> {
    const response = await api.patch<Trade>(`/trades/${id}/cancel`);
    return response.data;
  },

  async acceptTrade(id: number): Promise<Trade> {
    const response = await api.post<Trade>(`/trades/${id}/accept`);
    return response.data;
  },

  async rejectTrade(id: number): Promise<Trade> {
    const response = await api.post<Trade>(`/trades/${id}/reject`);
    return response.data;
  },
};
