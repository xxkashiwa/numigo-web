import { useConversation } from '@/hooks/use-conversation';
import { Welcome } from '@ant-design/x';
import Image from 'next/image';
import { ChatMessage } from './chat-message';
export const ChatMessageList = () => {
  const { chatLogs } = useConversation();
  // 创建 logo 图标的 ReactNode
  const logoIcon = (
    <Image
      src="/logo-icon.png"
      alt="Logo"
      width={100}
      height={100}
      priority
      className="h-full max-h-24 w-full max-w-24"
    />
  );
  return (
    <div className="flex h-full w-full flex-col overflow-y-hidden p-4">
      {chatLogs.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <Welcome
            icon={logoIcon}
            title="Hello, I'm NumiGo!"
            description="I can assist you with your queries."
            className="w-full bg-transparent text-primary"
          />
        </div>
      ) : (
        chatLogs.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
    </div>
  );
};
