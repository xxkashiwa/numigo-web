/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import { useAuthStore } from '@/store/use-auth-store';
import axios, { AxiosRequestConfig } from 'axios';
//'http://119.45.26.22:8123';
// 修改为相对路径，使用 Next.js 的 API 路由代理
const API_BASE_URL = 'http://119.45.26.22:8123';
// console.log('API_BASE_URL', API_BASE_URL);

export default (config: AxiosRequestConfig) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 180000,
    withCredentials: false,
  });
  instance.interceptors.request.use(
    config => {
      useAuthStore.setState({ isLoading: !useAuthStore.getState().isLoading });
      config.headers.Authorization = useAuthStore.getState().accessToken();
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );
  return instance(config);
};

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * 处理流式响应
 */
const stream = async (
  endpoint: string,
  data: any,
  onChunk: (chunk: string) => void
): Promise<ApiResponse<null>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  headers.Authorization = useAuthStore.getState().accessToken();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
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
        console.log('chunk\n', chunk);

        // 处理可能包含多个JSON对象的情况（按行分割）
        const lines = buffer.split('\n');
        let incompleteJson = '';

        for (let i = 0; i < lines.length - 1; i++) {
          let line = lines[i].trim();

          // 检查是否有 "data: data:" 前缀
          const hasDataDataPrefix = line.match(/^data: data:/);
          if (hasDataDataPrefix) {
            // 提取 "data: data:" 后面的内容
            line = line.substring(11);
          }
          // 检查是否有一般的 "data:" 前缀
          else if (line.startsWith('data: ')) {
            line = line.substring(6);
          }

          // 检测未闭合的 JSON
          if (
            line &&
            !incompleteJson &&
            line.includes('{') &&
            !line.includes('}')
          ) {
            incompleteJson = line;
            continue;
          }

          // 如果有未闭合的 JSON，尝试与当前行组合
          if (incompleteJson) {
            // 检查当前行是否也有前缀需要处理
            if (line.match(/^data: data:/)) {
              line = line.substring(11);
            } else if (line.startsWith('data: ')) {
              line = line.substring(6);
            }

            line = incompleteJson + line;
            incompleteJson = '';

            // 如果组合后仍未闭合，继续累积
            if (line.includes('{') && !line.includes('}')) {
              incompleteJson = line;
              continue;
            }
          }

          // 提取可能的 JSON 对象
          const eventData = line.match(/{.*}/);
          if (eventData) {
            try {
              const json = JSON.parse(eventData[0]);
              console.log('json\n', json);
              if (json.answer && json.status !== 10) {
                onChunk(json.answer);
              }
            } catch (error) {
              console.log('解析 JSON 失败:', eventData);
            }
          } else {
            // 非 JSON 数据处理
            if (line && !line.match(/^\s*$/)) {
              console.log('非 JSON 数据:', line);
            }
          }
        }

        // 保留最后一行，可能是不完整的数据
        buffer = lines[lines.length - 1];
      }
    }

    // 处理缓冲区中剩余的数据
    if (buffer.trim()) {
      // 检查是否有 "data: data:" 前缀
      if (buffer.trim().startsWith('data: data:')) {
        buffer = buffer.trim().substring(11);
      } else if (buffer.trim().startsWith('data: ')) {
        buffer = buffer.trim().substring(6);
      }

      try {
        const jsonMatch = buffer.match(/{.*}/);
        if (jsonMatch) {
          const json = JSON.parse(jsonMatch[0]);
          if (json.answer && json.status !== 10) {
            onChunk(json.answer);
          }
        } else {
          onChunk(buffer);
        }
      } catch (error) {
        console.log('解析剩余 JSON 失败:', buffer);
        onChunk(buffer);
      }
    }

    return { status: response.status };
  } catch (error) {
    return {
      error: '网络错误',
      status: 500,
    };
  }
};

export { stream };
