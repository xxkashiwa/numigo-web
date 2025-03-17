'use client';
import { ChatMessageList } from '@/components/chat-message-list';
import InputBox from '@/components/inputbox';

const ChatPage = () => {
  return (
    <div className="flex h-[95vh] w-full flex-col items-center justify-between">
      <div className="flex w-full flex-grow overflow-auto">
        <div className="flex w-full flex-col items-center overflow-y-auto">
          <div className="w-full md:max-w-3xl">
            <ChatMessageList />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center pt-2">
        <div className="w-full md:max-w-3xl">
          <InputBox />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
