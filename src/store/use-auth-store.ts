import { getCurrentUser, login, register } from '@/services/user-service';
import { UserData, UserLoginData, UserRegisterData } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authToken?: string;

  // 操作方法
  login: (loginData: UserLoginData) => Promise<void>;
  register: (registerData: UserRegisterData) => Promise<void>;
  accessToken: () => string;
  logout: () => void;
  fetchCurrentUser: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      accessToken: () => {
        return 'Bearer ' + get().authToken;
      },
      login: async (loginData: UserLoginData) => {
        set({ isLoading: true, error: null });
        try {
          // const response = await AuthService.login(loginData);
          // if (response.error) {
          //   set({
          //     error: response.error,
          //     isLoading: false,
          //     isAuthenticated: false,
          //   });
          //   return;
          // }
          const response = await login(loginData);

          if (response.status === 200) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              authToken: response.data.access_token,
            });
          } else {
            set({
              error: response.data.detail || '登录失败',
              user: null,
              isAuthenticated: false,
            });
          }
          // 登录成功后获取用户信息
          // await get().fetchCurrentUser();
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '登录失败',
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
        }
      },

      register: async (registerData: UserRegisterData) => {
        set({ isLoading: true, error: null });
        try {
          // const response = await AuthService.register(registerData);
          const response = await register(registerData);
          if (response.status !== 200) {
            set({
              error: response.data.detail || '注册失败',
              user: null,
              isAuthenticated: false,
            });
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
        set({ user: null, isAuthenticated: false, authToken: '' });
      },
      fetchCurrentUser: async () => {
        try {
          const response = await getCurrentUser();
          set({
            user: response.data,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '获取用户信息失败',
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      //   set({ isLoading: true });
      //   try {
      //     const response = await getCurrentUser();
      //     if (response.status !== 200) {
      //       set({
      //         error: response.data.detail || '获取用户信息失败',
      //         isLoading: false,
      //         isAuthenticated: false,
      //         user: null,
      //         authToken: '',
      //       });
      //       return;
      //     }

      //     set({
      //       user: response.data,
      //       isAuthenticated: true,
      //       isLoading: false,
      //       authToken: state.authToken,
      //     });
      //   } catch (error) {
      //     set({
      //       error: error instanceof Error ? error.message : '获取用户信息失败',
      //       isLoading: false,
      //       isAuthenticated: false,
      //     });
      //   }
      // },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage的键名
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken,
      }),
    }
  )
);
