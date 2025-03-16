import { useConversation } from '@/hooks/useConversation';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';

export const ChatMessageList = () => {
  const { chatLogs } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLogs]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-4">
      {chatLogs.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">开始一个新的对话吧！</p>
        </div>
      ) : (
        chatLogs.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
