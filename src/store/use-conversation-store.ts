import {
  createConversation,
  formatChatHistory,
  saveResponse,
  sendMessage,
} from '@/services/conversation';
import { ConversationService } from '@/services/conversation-service';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatLog {
  sender: 'user' | 'model1';
  message: string;
  isPartial?: boolean;
}

interface ConversationState {
  currentConversationId: number | null;
  chatTitle: string;
  chatLogs: ChatLog[];
  isLoading: boolean;
  error: string | null;

  // 操作方法
  getConversationId: () => Promise<number>;
  sendMessageWithoutSaving: (message: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  setChatTitle: (title: string) => void;
  setCurrentConversationId: (id: number | null) => void;
  fetchCurrentConversation: () => void;
  clearError: () => void;
  clearChatLogs: () => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      chatLogs: [],
      chatTitle: 'Unnamed chat',
      isLoading: false,
      error: null,
      currentConversationId: null,
      getConversationId: async () => {
        if (get().currentConversationId !== null) {
          return get().currentConversationId;
        }

        set({ isLoading: true, error: null });

        try {
          const conversationId = await createConversation({
            title: get().chatTitle,
          });
          set({
            currentConversationId: conversationId.data.id,
            isLoading: false,
          });
          return conversationId.data.id;
        } catch (error) {
          console.error('创建会话失败:', error);
          set({
            error: error instanceof Error ? error.message : '创建会话失败',
            isLoading: false,
          });
          return null;
        }
      },
      setChatTitle: (title: string) => {
        set({ chatTitle: title });
      },
      sendMessage: async (content: string) => {
        if (get().currentConversationId === null) return;
        set({ isLoading: true, error: null });
        let responseContent = '';
        await sendMessage(
          get().currentConversationId!,
          {
            content,
            is_user: true,
            conversation_id: get().currentConversationId!,
          },
          chunk => {
            // 累积响应内容
            responseContent += chunk;

            // 更新临时响应到UI
            const currentLogs: ChatLog[] = [...get().chatLogs];

            // 检查是否已有模型回复，如果有则更新，否则添加新回复
            const modelResponseIndex = currentLogs.findIndex(
              log => log.sender === 'model1' && log.isPartial
            );

            if (modelResponseIndex >= 0) {
              currentLogs[modelResponseIndex].message = responseContent;
            } else {
              currentLogs.push({
                sender: 'model1' as const,
                message: responseContent,
                isPartial: true,
              });
            }

            set({ chatLogs: currentLogs });
          }
        );
        // 流式响应完成后，更新最终响应
        const finalLogs: ChatLog[] = [...get().chatLogs];
        const finalModelResponseIndex = finalLogs.findIndex(
          log => log.sender === 'model1' && log.isPartial
        );

        if (finalModelResponseIndex >= 0) {
          finalLogs[finalModelResponseIndex].message = responseContent;
          finalLogs[finalModelResponseIndex].isPartial = false;
        }
        await saveResponse(get().currentConversationId!, {
          content: responseContent,
          is_user: false,
          conversation_id: get().currentConversationId!,
        });
        set({ chatLogs: finalLogs, isLoading: false });
      },
      sendMessageWithoutSaving: async (content: string) => {
        if (!content.trim() || get().isLoading) return;

        set({ isLoading: true, error: null });

        try {
          // 添加用户消息到状态
          const updatedLogs: ChatLog[] = [
            ...get().chatLogs,
            {
              sender: 'user' as const,
              message: content,
            },
          ];

          set({ chatLogs: updatedLogs });

          // 准备历史对话数据
          // 将现有的聊天记录转换为API所需的格式 [Q1, A1, Q2, A2, ...]
          const chatHistory = formatChatHistory(
            get().chatLogs.filter(log => !log.isPartial) // 过滤掉部分响应
          );

          // 使用直接对话模式
          let responseContent = '';

          await ConversationService.chatWithLLM(
            {
              query: content,
              history_chat: chatHistory,
            },
            chunk => {
              // 累积响应内容
              responseContent += chunk;

              // 更新临时响应到UI
              const currentLogs: ChatLog[] = [...get().chatLogs];

              // 检查是否已有模型回复，如果有则更新，否则添加新回复
              const modelResponseIndex = currentLogs.findIndex(
                log => log.sender === 'model1' && log.isPartial
              );

              if (modelResponseIndex >= 0) {
                currentLogs[modelResponseIndex].message = responseContent;
              } else {
                currentLogs.push({
                  sender: 'model1' as const,
                  message: responseContent,
                  isPartial: true,
                });
              }

              set({ chatLogs: currentLogs });
            }
          );

          // 流式响应完成后，更新最终响应
          const finalLogs: ChatLog[] = [...get().chatLogs];
          const finalModelResponseIndex = finalLogs.findIndex(
            log => log.sender === 'model1' && log.isPartial
          );

          if (finalModelResponseIndex >= 0) {
            finalLogs[finalModelResponseIndex].message = responseContent;
            finalLogs[finalModelResponseIndex].isPartial = false;
          }

          set({ chatLogs: finalLogs });
        } catch (error) {
          console.error('发送消息失败:', error);

          // 添加错误消息到聊天记录
          const currentLogs: ChatLog[] = [...get().chatLogs];
          currentLogs.push({
            sender: 'model1' as const,
            message: '消息发送失败，请稍后重试。',
          });

          set({
            chatLogs: currentLogs,
            error: error instanceof Error ? error.message : '发送消息失败',
          });
        } finally {
          set({ isLoading: false });
        }
      },
      fetchCurrentConversation: async () => {},
      setCurrentConversationId: (id: number | null) => {
        set({ currentConversationId: id });
      },

      clearError: () => set({ error: null }),

      clearChatLogs: () => set({ chatLogs: [] }),
    }),
    {
      name: 'conversation-storage', // localStorage的键名
      partialize: state => ({
        chatLogs: state.chatLogs,
        currentConversationId: state.currentConversationId,
        chatTitle: state.chatTitle,
      }),
    }
  )
);
