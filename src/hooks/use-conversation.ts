import { useConversationStore } from '@/store/use-conversation-store';
import { useEffect } from 'react';
import { useAuth } from './use-auth';
export const useConversation = () => {
  const {
    chatLogs,
    isLoading,
    error,
    currentConversationId,
    chatTitle,
    setChatTitle,
    sendMessage,
    setCurrentConversationId,
    fetchCurrentConversation,
    getConversationId,
    clearError,
    clearChatLogs,
  } = useConversationStore();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!currentConversationId && isAuthenticated) {
      getConversationId();
    }
  }, [currentConversationId, isAuthenticated, getConversationId]);

  return {
    chatTitle,
    chatLogs,
    isLoading,
    error,
    currentConversationId,
    fetchCurrentConversation,
    setChatTitle,
    sendMessage,
    setCurrentConversationId,
    getConversationId,
    clearError,
    clearChatLogs,
  };
};
