import { api } from './api';
import { Card } from './cards';

export interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: 'OFFERING' | 'RECEIVING';
  card: Card;
}

export interface Trade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: TradeCard[];
}

export interface TradesResponse {
  list: Trade[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface CreateTradeRequest {
  cards: Array<{
    cardId: string;
    type: 'OFFERING' | 'RECEIVING';
  }>;
}

export const tradesService = {
  async getAllTrades(params?: { rpp?: number; page?: number }): Promise<TradesResponse> {
    const response = await api.get<TradesResponse>('/trades', { params });
    return response.data;
  },

  async createTrade(request: CreateTradeRequest): Promise<{ tradeId: string }> {
    const response = await api.post<{ tradeId: string }>('/trades', request);
    return response.data;
  },

  async deleteTrade(tradeId: string): Promise<void> {
    await api.delete(`/trades/${tradeId}`);
  },
};
