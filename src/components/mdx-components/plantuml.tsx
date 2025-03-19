/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import processJsonEscapes from '@/lib/process-json-escapes';
import { Copy } from 'lucide-react';
import plantumlEncoder from 'plantuml-encoder';
import { useEffect, useState } from 'react';
/**
 * PlantUML图表组件
 * @param children - PlantUML代码内容
 * @param title - 图表标题
 * @param alt - 图片alt文本
 */
const PlantUML = ({
  code,
  title = 'PlantUML图表',
  alt = 'PlantUML图表',
}: {
  code: string;
  title?: string;
  alt?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const proceesedCode = processJsonEscapes(code);
  useEffect(() => {
    if (typeof code === 'string') {
      try {
        // 编码PlantUML代码
        const encoded = plantumlEncoder.encode(proceesedCode);
        // 使用公共PlantUML服务器生成图片URL
        const url = `https://www.plantuml.com/plantuml/img/${encoded}`;
        setImageUrl(url);
      } catch (error) {
        console.error('PlantUML编码错误:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [code]);

  // 复制代码到剪贴板
  const copyToClipboard = () => {
    if (typeof code === 'string') {
      navigator.clipboard.writeText(proceesedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 切换显示代码
  const toggleShowCode = () => {
    setShowCode(!showCode);
  };

  // 打开图片模态框
  const openModal = () => {
    setShowModal(true);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // 关闭图片模态框
  const closeModal = () => {
    setShowModal(false);
  };

  // 处理缩放
  const handleZoom = (delta: number) => {
    setZoomLevel(prevZoom => {
      const newZoom = prevZoom + delta * 0.1;
      return Math.max(0.5, Math.min(5, newZoom)); // 限制缩放范围在0.5到5倍之间
    });
  };

  // 处理鼠标滚轮事件
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    handleZoom(delta);
  };

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 重置缩放和位置
  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (showModal) {
      // 添加全局鼠标事件监听器
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove as any);

      return () => {
        // 移除全局鼠标事件监听器
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove as any);
      };
    }
  }, [showModal, isDragging, startPosition]);

  return (
    <div className="my-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-white">
        <span className="text-sm">{title}</span>
        <div className="flex space-x-2">
          <button
            onClick={toggleShowCode}
            className="text-gray-300 transition-colors hover:text-white"
            title={showCode ? '隐藏代码' : '显示代码'}
          >
            {showCode ? '隐藏代码' : '显示代码'}
          </button>
          <button
            onClick={copyToClipboard}
            className="text-gray-300 transition-colors hover:text-white"
            title="复制代码"
          >
            <Copy size={16} />
            <span className="sr-only">复制代码</span>
            {copied && (
              <span className="absolute right-0 top-0 rounded bg-green-500 px-2 py-1 text-xs text-white">
                已复制!
              </span>
            )}
          </button>
        </div>
      </div>

      {showCode && (
        <div className="bg-gray-100 p-4">
          <pre className="whitespace-pre-wrap text-sm text-black">
            {proceesedCode}
          </pre>
        </div>
      )}

      <div className="w-full bg-white p-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span>加载图表中...</span>
          </div>
        ) : imageUrl ? (
          <div className="flex w-full justify-center overflow-auto">
            <img
              src={imageUrl}
              alt={alt}
              className="w-full cursor-pointer"
              onClick={openModal}
              onError={() => console.error('PlantUML图片加载失败')}
            />
          </div>
        ) : (
          <div className="p-4 text-red-500">
            无法生成PlantUML图表，请检查语法是否正确。
          </div>
        )}
      </div>

      {/* 图片放大模态框 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* 控制按钮 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center space-x-2 bg-opacity-50 p-2">
              <button
                className="rounded bg-white px-2 py-1 text-sm text-black"
                onClick={() => handleZoom(1)}
                title="放大"
              >
                +
              </button>
              <button
                className="rounded bg-white px-2 py-1 text-sm text-black"
                onClick={() => handleZoom(-1)}
                title="缩小"
              >
                -
              </button>
              <button
                className="rounded bg-white px-2 py-1 text-sm text-black"
                onClick={resetZoom}
                title="重置"
              >
                重置
              </button>
              <span className="rounded bg-white px-2 py-1 text-sm text-black">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>

            <button
              className="absolute -right-0 top-2 z-10 rounded-2xl bg-white px-2 text-black"
              onClick={e => {
                e.stopPropagation();
                closeModal();
              }}
            >
              x
            </button>

            <div
              className="flex h-[85vh] w-[85vw] items-center justify-center overflow-hidden"
              onWheel={handleWheel}
            >
              <img
                src={imageUrl}
                alt={alt}
                className="select-none object-contain"
                style={{
                  transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                onMouseDown={handleMouseDown}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantUML;
