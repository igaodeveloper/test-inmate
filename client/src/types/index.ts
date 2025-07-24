export * from '@shared/schema';

export interface ApiError {
  message: string;
  status?: number;
}

export interface QueryParams {
  page?: number;
  rpp?: number;
  search?: string;
  category?: string;
}
