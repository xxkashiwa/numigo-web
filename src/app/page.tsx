'use client';
import AppSender from '@/components/app-sender';
import { ChatMessageList } from '@/components/chat-message-list';
import { useConversation } from '@/hooks/use-conversation';
import { Welcome } from '@ant-design/x';
import Image from 'next/image';

const Home = () => {
  const { isLoading, chatLogs } = useConversation();
  if (chatLogs.length > 0 && !isLoading) {
    window.location.href = '/chat';
  }

  // Create logo icon ReactNode
  const logoIcon = (
    <Image
      src="/logo-icon.png"
      alt="Logo"
      width={80}
      height={60}
      priority
      className="h-full max-h-48 w-full max-w-48"
    />
  );

  return (
    <div className="flex h-[90vh] w-full bg-background">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-7 md:max-w-3xl">
          {isLoading ? (
            <div className="flex w-full flex-col items-center">
              <div className="w-full md:max-w-3xl">
                <ChatMessageList />
              </div>
            </div>
          ) : (
            <Welcome
              icon={logoIcon}
              title="Hello, I'm NumiGo!"
              description="I can assist you with your queries."
              className="w-full bg-transparent text-primary"
            />
          )}

          <div className="w-full">
            <AppSender />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
