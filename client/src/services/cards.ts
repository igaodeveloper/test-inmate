import { api } from './api';

export interface Card {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  rarity: string;
  category: string;
  createdAt: string;
  updatedAt: string;
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

export const cardsService = {
  async getAll(page: number = 1, rpp: number = 10, search?: string) {
    const response = await api.get<PaginatedResponse<Card>>('/cards', {
      params: { page, rpp, search },
    });
    return response.data;
  },

  async getById(id: number): Promise<Card> {
    const response = await api.get<Card>(`/cards/${id}`);
    return response.data;
  },

  async getUserCards(page: number = 1, rpp: number = 10) {
    const response = await api.get<PaginatedResponse<Card>>('/me/cards', {
      params: { page, rpp },
    });
    return response.data;
  },

  async addCardToUser(cardId: number, condition?: string) {
    const response = await api.post('/me/cards', { cardId, condition });
    return response.data;
  },

  async searchCards(query: string, page: number = 1, rpp: number = 10) {
    const response = await api.get<PaginatedResponse<Card>>('/cards', {
      params: { search: query, page, rpp },
    });
    return response.data;
  },
};
