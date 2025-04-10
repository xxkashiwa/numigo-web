import convertCustomTags from '@/lib/convert-custom-tags';
import processJsonEscapes from '@/lib/process-json-escapes';
import processWrongLatex from '@/lib/process-wrong-latex';
import { ChatLog } from '@/store/use-conversation-store';
import MDXRenderer from './mdx-components/mdx-renderer';
interface ChatMessageProps {
  message: ChatLog;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const debug = false;
  // 处理文本
  let processedMessage = message.message ? message.message : '';

  // 1. 处理JSON字符串中的转义字符
  processedMessage = processJsonEscapes(processedMessage);
  // 2. 处理错误格式的LaTeX标记
  processedMessage = processWrongLatex(processedMessage);
  // 3. 处理自定义标签
  if (!debug) {
    processedMessage = convertCustomTags(processedMessage);
  }
  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 text-xl`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser ? 'bg-blue-200 bg-opacity-50' : 'text-gray-800'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.isPartial ? (
            processedMessage
          ) : debug ? (
            processedMessage
          ) : (
            <MDXRenderer message={processedMessage} />
          )}
        </div>
        {message.isPartial && (
          <div className="mt-1 flex items-center">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400"></div>
            <div className="mx-1 h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400"></div>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400"></div>
          </div>
        )}
      </div>
    </div>
  );
};
