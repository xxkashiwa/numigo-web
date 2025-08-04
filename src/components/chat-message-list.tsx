import { useConversation } from '@/hooks/use-conversation';
import { ChatMessage } from './chat-message';
import HelloNumigo from './hello-numigo';
export const ChatMessageList = () => {
  const { chatLogs } = useConversation();

  return (
    <div className="flex h-full w-full flex-col overflow-y-hidden p-4">
      {chatLogs.length === 0 ? (
        <HelloNumigo />
      ) : (
        chatLogs.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
    </div>
  );
};
