/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useConversation } from '@/hooks/use-conversation';
import { useState } from 'react';
const InputBox = () => {
  const [inputText, setInputText] = useState('');
  const { isLoading, sendMessage } = useConversation();

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInputText(textarea.value);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    // 检查当前页面路径，只有在非chat页面时才导航到chat页面

    // 发送消息

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

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex w-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <div className="m-1 w-full">
        <textarea
          className="max-h-[200px] w-full resize-none border-none bg-inherit focus:outline-none focus:ring-0"
          placeholder="发送消息..."
          rows={1}
          value={inputText}
          onChange={handleTextareaInput}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </div>
      <div className="flex w-full justify-between pt-4">
        <div className="inline-flex gap-2">{/* <AttachButton /> */}</div>
        <div className="inline-flex gap-2">
          {/* <ExpandButton /> */}
          {isLoading ? (
            <PauseButton
              onClick={() => {
                // window.location.reload();
              }}
            />
          ) : (
            <EnterButton onClick={handleSendMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

// const AttachButton = () => {
//   return (
//     <button className="h-full w-8 rounded-xl bg-gray-600 bg-opacity-0 transition-all duration-300 hover:bg-opacity-30">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         height="24px"
//         viewBox="0 -960 960 960"
//         width="24px"
//         className="h-full w-full"
//       >
//         <path d="M640-520v-200h80v200h-80ZM440-244q-35-10-57.5-39T360-350v-370h80v476Zm30 164q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v300h-80v-300q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q25 0 47.5-6.5T560-186v89q-21 8-43.5 12.5T470-80Zm170-40v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" />
//       </svg>
//     </button>
//   );
// };

// const ExpandButton = () => {
//   return (
//     <button className="h-full w-8 rounded-xl bg-gray-600 bg-opacity-0 transition-all duration-300 hover:bg-opacity-30">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         height="24px"
//         viewBox="0 -960 960 960"
//         width="24px"
//         className="h-full w-full"
//       >
//         <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" />
//       </svg>
//     </button>
//   );
// };

const EnterButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="h-full w-9 rounded-3xl bg-black transition-all duration-300 hover:bg-opacity-60"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full fill-white"
      >
        <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z" />
      </svg>
    </button>
  );
};

const PauseButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="h-full w-9 rounded-3xl bg-black transition-all duration-300 hover:bg-opacity-60"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full fill-white p-1"
      >
        <path d="M214-74q-58.77 0-99.39-40.61Q74-155.23 74-214v-532q0-58.78 40.61-99.39Q155.23-886 214-886h532q58.78 0 99.39 40.61T886-746v532q0 58.77-40.61 99.39Q804.78-74 746-74H214Zm0-140h532v-532H214v532Zm0 0v-532 532Z" />
      </svg>
    </button>
  );
};
export default InputBox;
