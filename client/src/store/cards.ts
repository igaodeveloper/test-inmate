import { create } from 'zustand';
import { api } from '@/lib/axios';
import type { Card, UserCard, AddCardData, PaginatedResponse, QueryParams } from '@/types';

interface CardsState {
  allCards: Card[];
  userCards: UserCard[];
  isLoading: boolean;
  pagination: {
    page: number;
    rpp: number;
    total: number;
    totalPages: number;
  };
  fetchAllCards: (params?: QueryParams) => Promise<void>;
  fetchUserCards: (params?: QueryParams) => Promise<void>;
  addCardToUser: (data: AddCardData) => Promise<void>;
  searchCards: (query: string) => Promise<Card[]>;
}

export const useCardsStore = create<CardsState>((set, get) => ({
  allCards: [],
  userCards: [],
  isLoading: false,
  pagination: {
    page: 1,
    rpp: 20,
    total: 0,
    totalPages: 0,
  },

  fetchAllCards: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get<PaginatedResponse<Card>>('/cards', { params });
      set({
        allCards: response.data.data,
        pagination: response.data.meta,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchUserCards: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get<PaginatedResponse<UserCard>>('/me/cards', { params });
      set({
        userCards: response.data.data,
        pagination: response.data.meta,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addCardToUser: async (data: AddCardData) => {
    try {
      await api.post('/me/cards', data);
      // Refresh user cards
      get().fetchUserCards();
    } catch (error) {
      throw error;
    }
  },

  searchCards: async (query: string) => {
    try {
      const response = await api.get<Card[]>(`/cards?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));
