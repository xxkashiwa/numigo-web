import {
  AuthService,
  UserData,
  UserLoginData,
  UserRegisterData,
} from '@/services/auth-service';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // 操作方法
  login: (loginData: UserLoginData) => Promise<void>;
  register: (registerData: UserRegisterData) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: AuthService.isLoggedIn(),

      login: async (loginData: UserLoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login(loginData);

          if (response.error) {
            set({
              error: response.error,
              isLoading: false,
              isAuthenticated: false,
            });
            return;
          }

          // 登录成功后获取用户信息
          await get().fetchCurrentUser();
          set({ isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '登录失败',
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      register: async (registerData: UserRegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.register(registerData);
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }

          // 注册成功后自动登录
          await get().login({
            username: registerData.username,
            password: registerData.password,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '注册失败',
            isLoading: false,
          });
        }
      },

      logout: () => {
        AuthService.logout();
        set({ user: null, isAuthenticated: false });
      },

      fetchCurrentUser: async () => {
        if (!AuthService.isLoggedIn()) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await AuthService.getCurrentUser();
          if (response.error) {
            set({
              error: response.error,
              isLoading: false,
              isAuthenticated: false,
            });
            return;
          }

          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '获取用户信息失败',
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage的键名
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
