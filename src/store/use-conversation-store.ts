/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createConversation,
  getMessages,
  saveResponse,
  sendMessage,
} from '@/services/conversation';
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
  fetchMessages: () => void;
  // sendMessageWithoutSaving: (message: string) => Promise<void>;
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
      chatTitle: '未使用对话',
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
        if (get().currentConversationId === null) {
          const id = await get().getConversationId();
          set({
            currentConversationId: id,
          });
        }
        set({ isLoading: true, error: null });
        const updatedLogs: ChatLog[] = [
          ...get().chatLogs,
          {
            sender: 'user' as const,
            message: content,
          },
        ];

        set({ chatLogs: updatedLogs });
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
              const plantUMLCloseIndex =
                currentLogs[modelResponseIndex].message.indexOf('</PlantUML>');
              const pythonCloseINdex =
                currentLogs[modelResponseIndex].message.indexOf('</Python>');
              const pyResultCloseIndex =
                currentLogs[modelResponseIndex].message.indexOf('</PyResult>');
              if (
                plantUMLCloseIndex !== -1 ||
                pythonCloseINdex !== -1 ||
                pyResultCloseIndex !== -1
              ) {
                currentLogs[modelResponseIndex].isPartial = false;
                const closeIndex =
                  plantUMLCloseIndex !== -1
                    ? plantUMLCloseIndex + 12
                    : pythonCloseINdex !== -1
                      ? pythonCloseINdex + 10
                      : pyResultCloseIndex + 12;
                const customTag = currentLogs[
                  modelResponseIndex
                ].message.substring(0, closeIndex);

                const restText =
                  currentLogs[modelResponseIndex].message.substring(closeIndex);
                // console.log('palntUMLIndex', palntUMLIndex);
                responseContent = '';
                currentLogs[modelResponseIndex].message = customTag;
                saveResponse(get().currentConversationId!, {
                  content: customTag,
                  is_user: false,
                  conversation_id: get().currentConversationId!,
                });
                currentLogs.push({
                  sender: 'model1' as const,
                  message: restText,
                  isPartial: true,
                });
              }
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
      fetchCurrentConversation: async () => {},
      fetchMessages: async () => {
        if (get().currentConversationId === null) {
          console.error('currentConversationId is null');
          return;
        }
        set({ isLoading: true, error: null });

        try {
          const response = await getMessages(get().currentConversationId!);
          const messages = response.data;
          const chatLogs: ChatLog[] = messages.map((message: any) => ({
            sender: message.is_user ? 'user' : 'model1',
            message: message.content,
          }));
          set({ chatLogs, isLoading: false });
        } catch (error) {
          console.error('获取消息失败:', error);
          set({
            error: error instanceof Error ? error.message : '获取消息失败',
            isLoading: false,
          });
        }
      },
      setCurrentConversationId: (id: number | null) => {
        set({ currentConversationId: id });
        get().fetchMessages();
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
