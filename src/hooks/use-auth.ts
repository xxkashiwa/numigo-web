'use client';
import { useAuthStore } from '@/store/use-auth-store';

export const useAuth = () => {
  const {
    user,
    isLoading,
    authToken,
    error,
    isAuthenticated,
    login,
    register,
    accessToken,
    logout,
    clearError,
  } = useAuthStore();

  return {
    user,
    isLoading,
    error,
    authToken,
    isAuthenticated,
    login,
    register,
    logout,
    accessToken,
    clearError,
  };
};
