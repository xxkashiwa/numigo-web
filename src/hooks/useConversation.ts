import { useConversationStore } from '@/store/useConversationStore';
import { useEffect } from 'react';

export const useConversation = () => {
  const {
    chatLogs,
    isLoading,
    error,
    currentConversationId,
    sendMessage,
    setCurrentConversationId,
    clearError,
    clearChatLogs,
  } = useConversationStore();

  // 组件挂载时从localStorage获取当前会话ID
  useEffect(() => {
    const storedConversationId = localStorage.getItem('currentConversationId');
    if (storedConversationId && !currentConversationId) {
      setCurrentConversationId(parseInt(storedConversationId));
    }
  }, [currentConversationId, setCurrentConversationId]);

  return {
    chatLogs,
    isLoading,
    error,
    currentConversationId,
    sendMessage,
    setCurrentConversationId,
    clearError,
    clearChatLogs,
  };
};
