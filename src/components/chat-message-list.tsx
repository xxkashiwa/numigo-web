import { useConversation } from '@/hooks/use-conversation';
import { ChatMessage } from './chat-message';

export const ChatMessageList = () => {
  const { chatLogs } = useConversation();

  return (
    <div className="flex h-full w-full flex-col overflow-y-hidden p-4">
      {chatLogs.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">开始一个新的对话吧！</p>
        </div>
      ) : (
        chatLogs.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
    </div>
  );
};
