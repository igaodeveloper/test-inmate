import { api } from './api';

// Define the Card interface based on the API response
export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
}

// Define the paginated response type
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Define the cards service with proper typing
export const cardService = {
  /**
   * Fetch all cards with pagination
   */
  async getCards(params?: { 
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Card>> {
    try {
      const response = await api.get<PaginatedResponse<Card>>('/cards', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      throw error;
    }
  },

  /**
   * Fetch a single card by ID
   */
  async getCardById(id: string): Promise<Card> {
    try {
      const response = await api.get<{ data: Card }>(`/cards/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch card ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetch cards in the user's collection
   */
  async getUserCards(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Card>> {
    try {
      const response = await api.get<PaginatedResponse<Card>>('/me/cards', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user cards:', error);
      throw error;
    }
  },

  /**
   * Add cards to user's collection
   */
  async addCardsToUser(cardIds: string[]): Promise<void> {
    try {
      await api.post('/me/cards', { cardIds });
    } catch (error) {
      console.error('Failed to add cards to collection:', error);
      throw error;
    }
  },

  /**
   * Search for cards
   */
  async searchCards(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Card>> {
    try {
      const response = await api.get<PaginatedResponse<Card>>('/cards/search', {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search cards:', error);
      throw error;
    }
  },
} as const;
