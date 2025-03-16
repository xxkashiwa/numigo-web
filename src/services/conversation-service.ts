/**
 * 对话服务
 * 处理对话和消息的创建、获取等功能
 */

import { apiClient } from './api-client';

export interface ConversationData {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface MessageData {
  id: number;
  conversation_id: number;
  content: string;
  is_user: boolean;
  created_at: string;
}

export interface ConversationCreateData {
  title: string;
}

export interface MessageCreateData {
  content: string;
}

export interface LLMRequestData {
  query: string;
  history_chat: string[];
}

export class ConversationService {
  /**
   * 创建新对话
   */
  static async createConversation(data: ConversationCreateData) {
    return apiClient.post<ConversationData>('/api/conversations', data);
  }

  /**
   * 获取用户的所有对话
   */
  static async getConversations() {
    return apiClient.get<ConversationData[]>('/api/conversations');
  }

  /**
   * 获取特定对话
   */
  static async getConversation(conversationId: number) {
    return apiClient.get<ConversationData>(
      `/api/conversations/${conversationId}`
    );
  }

  /**
   * 获取对话的所有消息
   */
  static async getMessages(conversationId: number) {
    return apiClient.get<MessageData[]>(
      `/api/conversations/${conversationId}/messages`
    );
  }

  /**
   * 发送消息并获取LLM回复（流式响应）
   */
  static async sendMessage(
    conversationId: number,
    message: MessageCreateData,
    onChunk: (chunk: string) => void
  ) {
    return apiClient.stream(
      `/api/conversations/${conversationId}/messages`,
      message,
      onChunk
    );
  }

  /**
   * 保存LLM回复
   */
  static async saveLLMResponse(conversationId: number, content: string) {
    return apiClient.post<MessageData>(
      `/api/conversations/${conversationId}/save_response`,
      { content }
    );
  }

  /**
   * 直接与LLM对话（无历史记录）
   */
  static async chatWithLLM(
    request: LLMRequestData,
    onChunk: (chunk: string) => void
  ) {
    return apiClient.stream('/api/llm/chat', request, onChunk);
  }
  /**
   * 将聊天记录转换为API所需的格式
   * 将ChatLog[]格式转换为[Q1, A1, Q2, A2, ...]格式
   */
  static formatChatHistory(
    chatLogs: { sender: string; message: string }[]
  ): string[] {
    const history: string[] = [];

    for (let i = 0; i < chatLogs.length; i += 2) {
      const userMessage = chatLogs[i];
      const modelMessage = chatLogs[i + 1];

      if (userMessage && userMessage.sender === 'user') {
        history.push(userMessage.message);

        if (modelMessage && modelMessage.sender === 'model1') {
          history.push(modelMessage.message);
        }
      }
    }

    return history;
  }
}
