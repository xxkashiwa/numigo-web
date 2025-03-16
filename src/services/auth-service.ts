/**
 * 用户认证服务
 * 处理用户登录、注册等认证相关功能
 */

import { apiClient } from './api-client';

export interface UserRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
}

export interface TokenData {
  access_token: string;
  token_type: string;
}

export class AuthService {
  /**
   * 用户注册
   */
  static async register(userData: UserRegisterData) {
    return apiClient.post<UserData>('/api/users/register', userData);
  }

  /**
   * 用户登录
   */
  static async login(loginData: UserLoginData) {
    // 将用户名和密码转换为表单数据格式，符合OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      // 保存token到客户端
      apiClient.setToken(data.access_token);
      return { data, status: response.status };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.detail || '登录失败',
        status: response.status,
      };
    }
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser() {
    return apiClient.get<UserData>('/api/users/me');
  }

  /**
   * 退出登录
   */
  static logout() {
    apiClient.clearToken();
  }

  /**
   * 检查用户是否已登录
   */
  static isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('auth_token') !== null;
  }
}
