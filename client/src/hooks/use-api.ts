import { useState, useCallback } from 'react';
import { ApiError } from '@/types';

type ApiFunction<T extends any[], R> = (...args: T) => Promise<R>;

export function useApi<T extends any[], R>(apiFunction: ApiFunction<T, R>) {
  const [data, setData] = useState<R | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: T): Promise<R> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const error = err as ApiError;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, error, isLoading, execute };
}
