'use client';
import { useAuthStore } from '@/store/use-auth-store';
import { useEffect } from 'react';

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
    fetchCurrentUser,
    logout,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);
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
