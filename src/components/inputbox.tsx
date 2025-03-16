/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AuthService } from '@/services/auth-service';
import {
  ConversationService,
  MessageCreateData,
} from '@/services/conversation-service';
import { useEffect, useState } from 'react';

const InputBox = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);

  // 在组件加载时检查是否有当前会话ID
  useEffect(() => {
    // 从localStorage获取当前会话ID
    const storedConversationId = localStorage.getItem('currentConversationId');
    if (storedConversationId) {
      setCurrentConversationId(parseInt(storedConversationId));
    }
  }, []);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInputText(textarea.value);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // 获取当前对话记录
      const currentLogs = JSON.parse(localStorage.getItem('chatLogs') || '[]');

      // 添加用户消息到本地存储
      currentLogs.push({
        sender: 'user',
        message: inputText,
      });

      // 更新本地存储并触发UI更新
      localStorage.setItem('chatLogs', JSON.stringify(currentLogs));
      window.dispatchEvent(
        new CustomEvent('chatUpdated', {
          detail: { scrollToTop: false },
        })
      );

      // 准备发送到API的消息数据
      const messageData: MessageCreateData = {
        content: inputText,
      };

      // 清空输入框
      setInputText('');

      // 重置输入框高度
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }

      // 检查用户是否已登录
      if (!AuthService.isLoggedIn()) {
        // 未登录时使用直接对话模式
        let responseContent = '';

        await ConversationService.chatWithLLM({ query: inputText }, chunk => {
          // 累积响应内容
          responseContent += chunk;

          // 更新临时响应到UI
          const updatedLogs = JSON.parse(
            localStorage.getItem('chatLogs') || '[]'
          );

          // 检查是否已有模型回复，如果有则更新，否则添加新回复
          const modelResponseIndex = updatedLogs.findIndex(
            (log: any) => log.sender === 'model1' && log.isPartial
          );

          if (modelResponseIndex >= 0) {
            updatedLogs[modelResponseIndex].message = responseContent;
          } else {
            updatedLogs.push({
              sender: 'model1',
              message: responseContent,
              isPartial: true,
            });
          }

          localStorage.setItem('chatLogs', JSON.stringify(updatedLogs));
          window.dispatchEvent(
            new CustomEvent('chatUpdated', {
              detail: { scrollToTop: false },
            })
          );
        });

        // 流式响应完成后，更新最终响应
        const finalLogs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
        const finalModelResponseIndex = finalLogs.findIndex(
          (log: any) => log.sender === 'model1' && log.isPartial
        );

        if (finalModelResponseIndex >= 0) {
          finalLogs[finalModelResponseIndex].message = responseContent;
          finalLogs[finalModelResponseIndex].isPartial = false;
        }

        localStorage.setItem('chatLogs', JSON.stringify(finalLogs));
        window.dispatchEvent(
          new CustomEvent('chatUpdated', {
            detail: { scrollToTop: false },
          })
        );
      } else {
        // 已登录用户，使用会话模式
        // 如果没有当前会话，创建一个新会话
        if (!currentConversationId) {
          const response = await ConversationService.createConversation({
            title:
              inputText.substring(0, 30) + (inputText.length > 30 ? '...' : ''),
          });

          if (response.data) {
            setCurrentConversationId(response.data.id);
            localStorage.setItem(
              'currentConversationId',
              response.data.id.toString()
            );
          } else {
            throw new Error('创建会话失败');
          }
        }

        // 确保此时有会话ID
        const conversationId =
          currentConversationId ||
          (localStorage.getItem('currentConversationId')
            ? parseInt(localStorage.getItem('currentConversationId')!)
            : null);

        if (!conversationId) {
          throw new Error('无法获取会话ID');
        }

        // 发送消息并获取流式响应
        let responseContent = '';

        await ConversationService.sendMessage(
          conversationId,
          messageData,
          chunk => {
            // 累积响应内容
            responseContent += chunk;

            // 更新临时响应到UI
            const updatedLogs = JSON.parse(
              localStorage.getItem('chatLogs') || '[]'
            );

            // 检查是否已有模型回复，如果有则更新，否则添加新回复
            const modelResponseIndex = updatedLogs.findIndex(
              (log: any) => log.sender === 'model1' && log.isPartial
            );

            if (modelResponseIndex >= 0) {
              updatedLogs[modelResponseIndex].message = responseContent;
            } else {
              updatedLogs.push({
                sender: 'model1',
                message: responseContent,
                isPartial: true,
              });
            }

            localStorage.setItem('chatLogs', JSON.stringify(updatedLogs));
            window.dispatchEvent(
              new CustomEvent('chatUpdated', {
                detail: { scrollToTop: false },
              })
            );
          }
        );

        // 流式响应完成后，保存LLM回复到服务器
        await ConversationService.saveLLMResponse(
          conversationId,
          responseContent
        );

        // 更新最终响应
        const finalLogs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
        const finalModelResponseIndex = finalLogs.findIndex(
          (log: any) => log.sender === 'model1' && log.isPartial
        );

        if (finalModelResponseIndex >= 0) {
          finalLogs[finalModelResponseIndex].message = responseContent;
          finalLogs[finalModelResponseIndex].isPartial = false;
        }

        localStorage.setItem('chatLogs', JSON.stringify(finalLogs));
        window.dispatchEvent(
          new CustomEvent('chatUpdated', {
            detail: { scrollToTop: false },
          })
        );
      }
    } catch (error) {
      console.error('发送消息失败:', error);

      // 显示错误消息
      const currentLogs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
      currentLogs.push({
        sender: 'model1',
        message: '消息发送失败，请稍后重试。',
      });

      localStorage.setItem('chatLogs', JSON.stringify(currentLogs));
      window.dispatchEvent(
        new CustomEvent('chatUpdated', {
          detail: { scrollToTop: false },
        })
      );
    } finally {
      setIsLoading(false);
    }

    // 检查当前页面路径，只有在非chat页面时才导航到chat页面
    if (!window.location.pathname.includes('/chat')) {
      window.location.href = '/chat';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
        <div className="inline-flex gap-2">
          <AttachButton />
        </div>
        <div className="inline-flex gap-2">
          <ExpandButton />
          <EnterButton onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

const AttachButton = () => {
  return (
    <button className="h-full w-8 rounded-xl bg-gray-600 bg-opacity-0 transition-all duration-300 hover:bg-opacity-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full"
      >
        <path d="M640-520v-200h80v200h-80ZM440-244q-35-10-57.5-39T360-350v-370h80v476Zm30 164q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v300h-80v-300q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q25 0 47.5-6.5T560-186v89q-21 8-43.5 12.5T470-80Zm170-40v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" />
      </svg>
    </button>
  );
};

const ExpandButton = () => {
  return (
    <button className="h-full w-8 rounded-xl bg-gray-600 bg-opacity-0 transition-all duration-300 hover:bg-opacity-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full"
      >
        <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" />
      </svg>
    </button>
  );
};

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
export default InputBox;
