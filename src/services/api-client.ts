/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API客户端基类
 * 处理与后端API的基础HTTP请求
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface SSEResponse {
  status: number;
  error: string;
  answer: string;
}

export class ApiClient {
  private token: string | null = null;

  constructor() {
    // 从localStorage获取token（如果存在）
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * 解析JSON字符串为对象
   * 如果解析失败，返回null
   */
  static parseJSON<T>(jsonString: string): T | null {
    try {
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.error('JSON解析错误:', e);
      return null;
    }
  }

  /**
   * 设置认证令牌
   */
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * 清除认证令牌
   */
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * 获取认证头信息
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * 发送GET请求
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, status: response.status };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.detail || '请求失败',
          status: response.status,
        };
      }
    } catch (error) {
      return {
        error: '网络错误',
        status: 500,
      };
    }
  }

  /**
   * 发送POST请求
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (response.ok) {
        const responseData = await response.json();
        return { data: responseData, status: response.status };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.detail || '请求失败',
          status: response.status,
        };
      }
    } catch (error) {
      return {
        error: '网络错误',
        status: 500,
      };
    }
  }

  /**
   * 处理流式响应
   */
  async stream(
    endpoint: string,
    data: any,
    onChunk: (chunk: string) => void
  ): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.detail || '请求失败',
          status: response.status,
        };
      }

      const reader = response.body?.getReader();
      if (!reader) {
        return {
          error: '无法读取响应流',
          status: 500,
        };
      }

      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          buffer += chunk;
          // 处理可能包含多个JSON对象的情况（按行分割）
          const lines = buffer.split('\n');
          for (let i = 0; i < lines.length - 1; i++) {
            const eventData = lines[i].match(/{.*}/);
            // console.log('eventData', eventData);
            if (eventData) {
              try {
                const json = JSON.parse(eventData[0]);
                if (json.answer) {
                  onChunk(json.answer);
                  // console.log('json.answer', json.answer);
                }
              } catch (error) {
                console.error('解析 JSON 失败:', eventData);
              }
            } else {
              onChunk('');
            }
          }
          buffer = lines[lines.length - 1];
        }
      }

      // 处理缓冲区中剩余的数据
      if (buffer.trim()) {
        onChunk(buffer);
      }

      return { status: response.status };
    } catch (error) {
      return {
        error: '网络错误',
        status: 500,
      };
    }
  }
}

// 导出单例实例
export const apiClient = new ApiClient();
