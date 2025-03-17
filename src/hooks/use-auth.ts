import { useAuthStore } from '@/store/use-auth-store';
import { useEffect } from 'react';

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  } = useAuthStore();

  // 组件挂载时检查用户状态
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  };
};
