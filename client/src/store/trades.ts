import { create } from 'zustand';
import { api } from '@/lib/axios';
import type { TradeWithCards, CreateTradeData, PaginatedResponse, QueryParams } from '@/types';

interface TradesState {
  trades: TradeWithCards[];
  userTrades: TradeWithCards[];
  isLoading: boolean;
  pagination: {
    page: number;
    rpp: number;
    total: number;
    totalPages: number;
  };
  fetchTrades: (params?: QueryParams) => Promise<void>;
  fetchUserTrades: (params?: QueryParams) => Promise<void>;
  createTrade: (data: CreateTradeData) => Promise<void>;
  deleteTrade: (tradeId: number) => Promise<void>;
}

export const useTradesStore = create<TradesState>((set, get) => ({
  trades: [],
  userTrades: [],
  isLoading: false,
  pagination: {
    page: 1,
    rpp: 20,
    total: 0,
    totalPages: 0,
  },

  fetchTrades: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get<PaginatedResponse<TradeWithCards>>('/trades', { params });
      set({
        trades: response.data.data,
        pagination: response.data.meta,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchUserTrades: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get<PaginatedResponse<TradeWithCards>>('/me/trades', { params });
      set({
        userTrades: response.data.data,
        pagination: response.data.meta,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTrade: async (data: CreateTradeData) => {
    try {
      await api.post('/trades', data);
      // Refresh trades
      get().fetchTrades();
      get().fetchUserTrades();
    } catch (error) {
      throw error;
    }
  },

  deleteTrade: async (tradeId: number) => {
    try {
      await api.delete(`/trades/${tradeId}`);
      // Remove from local state
      set(state => ({
        trades: state.trades.filter(trade => trade.id !== tradeId),
        userTrades: state.userTrades.filter(trade => trade.id !== tradeId),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
