import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      checkAuth();
    }
  }, [token, user, checkAuth]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
}
