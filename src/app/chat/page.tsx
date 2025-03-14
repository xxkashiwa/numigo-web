'use client';
import { useEffect, useState, useRef } from 'react';
import ModuleBubble from '@/components/bubbles/module-bubble';
import UserBubble from '@/components/bubbles/user-bubble';
import InputBox from '@/components/inputbox';

interface Dialog {
  sender: string;
  message: string;
}

const ChatPage = () => {
  const [logs, setLogs] = useState<Dialog[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到聊天容器底部
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // 滚动到聊天容器顶部
  const scrollToTop = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = 0;
    }
  };

  // 从localStorage加载聊天记录
  const loadChatLogs = () => {
    const storedLogs = localStorage.getItem('chatLogs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
      // 在下一个渲染周期滚动到底部
      setTimeout(scrollToBottom, 0);
    }
  };

  // 从localStorage加载聊天记录并指定滚动位置
  const loadChatLogsWithScroll = (shouldScrollToTop = false) => {
    const storedLogs = localStorage.getItem('chatLogs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
      // 使用requestAnimationFrame确保在DOM更新后执行滚动
      setTimeout(() => {
        requestAnimationFrame(() => {
          if (shouldScrollToTop) {
            scrollToTop();
          } else {
            scrollToBottom();
          }
        });
      }, 100); // 增加延迟时间，确保DOM完全更新
    }
  };

  useEffect(() => {
    // 初始加载聊天记录
    loadChatLogs();

    // 监听聊天更新事件
    const handleChatUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const shouldScrollToTop = customEvent.detail && customEvent.detail.scrollToTop;
      
      // 使用新函数加载聊天记录并指定滚动位置
      loadChatLogsWithScroll(shouldScrollToTop);
    };

    window.addEventListener('chatUpdated', handleChatUpdated);

    return () => {
      window.removeEventListener('chatUpdated', handleChatUpdated);
    };
  }, []);

  return (
    <div className="flex h-[95vh] w-full flex-col items-center justify-between">
      <div 
        ref={chatContainerRef}
        className="flex w-full flex-grow overflow-auto"
      >
        <div className="flex w-full flex-col items-center overflow-y-auto">
          <div className="w-full md:max-w-3xl">
            {logs.map((log, index) => {
              return log.sender === 'user' ? (
                <UserBubble message={log.message} key={index} />
              ) : (
                <ModuleBubble message={log.message} key={index} />
              );
            })}
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