/* eslint-disable react-hooks/exhaustive-deps */
import { useConversation } from '@/hooks/use-conversation';
import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface ScrollControlsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ScrollControls = ({ containerRef }: ScrollControlsProps) => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const { chatLogs } = useConversation();

  // 监听滚动事件，检测是否在顶部或底部
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setTimeout(() => {
        // 检查是否在顶部
        setIsAtTop(container.scrollTop === 0);

        // 检查是否在底部
        const isBottom =
          Math.abs(
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight
          ) < 10; // 10px的误差范围
        setIsAtBottom(isBottom);
      }, 100);
    };

    // 初始检查
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  useEffect(() => {
    scrollToBottom();
  }, [chatLogs]);

  return (
    <div className="fixed bottom-36 right-1/2 flex flex-row items-center gap-2">
      {!isAtTop && !isAtBottom && (
        <>
          <button
            onClick={scrollToTop}
            className="rounded-full bg-gray-200 bg-opacity-50 p-2 transition-colors hover:bg-gray-300"
            aria-label="滚动到顶部"
          >
            <IoIosArrowUp size={24} />
          </button>

          <button
            onClick={scrollToBottom}
            className="rounded-full bg-gray-200 bg-opacity-50 p-2 transition-colors hover:bg-gray-300"
            aria-label="滚动到底部"
          >
            <IoIosArrowDown size={24} />
          </button>
        </>
      )}
    </div>
  );
};
