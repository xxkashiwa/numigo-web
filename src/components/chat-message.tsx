import { ChatLog } from '@/store/useConversationStore';
import MDXRenderer from './mdx-renderer';
interface ChatMessageProps {
  message: ChatLog;
}

/**
 * 处理JSON字符串中的转义字符
 * @param text 原始文本
 * @returns 处理后的文本
 */
const processJsonEscapes = (text: string): string => {
  try {
    // 尝试将文本作为JSON字符串进行解析
    // 这会自动处理所有的转义字符
    // 注意：需要在文本外面加上引号，使其成为有效的JSON字符串
    const parsed = JSON.parse(`"${text.replace(/"/g, '\\"')}"`);
    return parsed;
  } catch (error) {
    // 如果解析失败，回退到简单的替换方法
    console.log('JSON解析失败，回退到简单替换:', error);

    // 简单替换常见的转义序列
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  }
};

/**
 * 将自定义标签转换为标准的MDX代码块格式
 * @param text 原始文本
 * @returns 转换后的文本
 */
const convertCustomTags = (text: string): string => {
  let result = text;
  // 处理<Python>标签
  result = text.replace(
    /<Python(?:\s+title="([^"]*)")?(?:\s+showLineNumbers=\{(true|false)\})?>([\s\S]*?)<\/Python>/g,
    (_, title, showLineNumbers, code) => {
      // 转义Python内容中的花括号
      // const escapedCode = code.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
      // 返回标准的MDX代码块格式
      return `<Python code='${code.trim()}'></Python>`;
    }
  );

  // 处理<PlantUML>标签
  result = result.replace(
    /<PlantUML(?:\s+title="([^"]*)")?(?:\s+alt="([^"]*)")?>([\s\S]*?)<\/PlantUML>/g,
    (_, title, alt, code) => {
      // 转义PlantUML内容中的花括号
      // const escapedCode = code.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
      // 返回标准的MDX代码块格式，使用plantuml语言标识符
      return `<PlantUML code='${code.trim()}'></PlantUML>`;
    }
  );

  return result;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  // 处理文本
  let processedMessage = message.message;

  // 1. 处理JSON字符串中的转义字符
  processedMessage = processJsonEscapes(processedMessage);

  // 2. 处理自定义标签
  processedMessage = convertCustomTags(processedMessage);

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.isPartial ? (
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
