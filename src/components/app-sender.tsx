import { useConversation } from '@/hooks/use-conversation';

import { Sender } from '@ant-design/x';
import { useState } from 'react';

const AppSender = () => {
  const [inputText, setInputText] = useState('');
  const { isLoading, sendMessage } = useConversation();
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // 清空输入框
    setInputText('');
    await sendMessage(inputText);
    if (!window.location.pathname.includes('/chat')) {
      window.location.href = '/chat';
    }

    // 重置输入框高度
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };

  return (
    <>
      <Sender
        loading={isLoading}
        value={inputText}
        onChange={v => {
          setInputText(v);
        }}
        onSubmit={handleSendMessage}
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
    </>
  );
};

export default AppSender;
