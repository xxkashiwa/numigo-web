import request, { stream } from './request';

interface ConversationCreateData {
  title: string;
}
interface ConversationMessageData {
  content: string;
  is_user: boolean;
  conversation_id: number;
}
interface LLMRequestData {
  query: string;
  history_chat: string[];
}
const createConversation = async (data: ConversationCreateData) => {
  return request({
    url: '/api/conversations',
    method: 'post',
    data,
  });
};
const getConversations = async () => {
  return request({
    url: '/api/conversations',
    method: 'get',
  });
};
const getConversation = async (id: number) => {
  return request({
    url: `/api/conversations/${id}`,
    method: 'get',
  });
};

const getMessages = async (id: number) => {
  return request({
    url: `/api/conversations/${id}/messages`,
    method: 'get',
  });
};
const sendMessage = async (
  id: number,
  data: ConversationMessageData,
  onChunk: (chunk: string) => void
) => {
  //   return request({
  //     url: `/api/conversations/${id}/messages`,
  //     method: 'post',
  //     data,
  //   });
  return stream(`/api/conversations/${id}/messages`, data, onChunk);
};
const saveResponse = async (id: number, data: ConversationMessageData) => {
  return request({
    url: `/api/conversations/${id}/save_response`,
    method: 'post',
    data,
  });
};

const formatChatHistory = (
  chatLogs: { sender: string; message: string }[]
): string[] => {
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
};
const chatWithoutSaving = async (
  request: LLMRequestData,
  onChunk: (chunk: string) => void
) => {
  return stream('/api/llm/chat', request, onChunk);
};
export {
  chatWithoutSaving,
  createConversation,
  formatChatHistory,
  getConversation,
  getConversations,
  getMessages,
  saveResponse,
  sendMessage,
};
