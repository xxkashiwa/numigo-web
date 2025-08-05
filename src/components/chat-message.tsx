import convertCustomTags from '@/lib/convert-custom-tags';
import processJsonEscapes from '@/lib/process-json-escapes';
import processWrongLatex from '@/lib/process-wrong-latex';
import { ChatLog } from '@/store/use-conversation-store';
import { Bubble } from '@ant-design/x';
import MDXRenderer from './mdx-components/mdx-renderer';
import { MessageFeedback } from './message-feedback';
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
      <div className="break-words">
        {message.isPartial ? (
          <Bubble
            content={processedMessage}
            typing={{ step: 2, interval: 10 }}
            className="rounded-none"
            variant="shadow"
            messageRender={(content: string) => (
              <MDXRenderer message={content} />
            )}
            style={{
              fontSize: '2rem', // 增加字体大小
              lineHeight: '1.6', // 设置适当的行高
            }}
          />
        ) : debug ? (
          processedMessage
        ) : (
          <>
            <div className="group">
              <Bubble
                content={processedMessage}
                messageRender={(content: string) => (
                  <MDXRenderer message={content} />
                )}
                variant="shadow"
              />

              {!isUser && (
                <MessageFeedback
                  messageId={`msg_${message.message.substring(0, 20).replace(/\s+/g, '_')}`}
                  onFeedback={(id, type) => {
                    console.log(`Message ${id} received feedback: ${type}`);
                    // Here you would call an API to save feedback
                  }}
                  onSimilarAnswer={id => {
                    console.log(`Similar answers requested for message ${id}`);
                    // Here you would trigger the similar answers functionality
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
