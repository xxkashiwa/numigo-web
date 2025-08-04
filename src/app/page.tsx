'use client';
import AppSender from '@/components/app-sender';
import { ChatMessageList } from '@/components/chat-message-list';
import HelloNumigo from '@/components/hello-numigo';
import { useConversation } from '@/hooks/use-conversation';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  if (!isAuthenticated) {
    router.push('/login');
  }

  const { isLoading, chatLogs } = useConversation();

  if (chatLogs.length > 0 && !isLoading) {
    router.push('/chat');
  }

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
            <HelloNumigo />
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
