import { useConversationStore } from '@/store/use-conversation-store';

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

  // 组件挂载时从localStorage获取当前会话ID
  // useEffect(() => {
  //   const storedConversationId = localStorage.getItem('currentConversationId');
  //   if (storedConversationId && !currentConversationId) {
  //     setCurrentConversationId(parseInt(storedConversationId));
  //   }
  // }, [currentConversationId, setCurrentConversationId]);

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
