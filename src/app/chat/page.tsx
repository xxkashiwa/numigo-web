'use client';
import AppSender from '@/components/app-sender';
import { ChatMessageList } from '@/components/chat-message-list';
import { ScrollControls } from '@/components/scroll-controls';
import { useRef } from 'react';

const ChatPage = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-[93vh] w-full flex-col items-center justify-between bg-background">
      <div ref={chatContainerRef} className="flex w-full overflow-y-auto">
        <div className="flex w-full flex-col items-center">
          <div className="w-full md:max-w-7xl">
            <ChatMessageList />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center pt-2">
        <div className="w-full md:max-w-4xl">
          <AppSender />
        </div>
      </div>

      <ScrollControls
        containerRef={chatContainerRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  );
};

export default ChatPage;
