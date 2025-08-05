/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import processJsonEscapes from '@/lib/process-json-escapes';
import { Copy } from 'lucide-react';
import plantumlEncoder from 'plantuml-encoder';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

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
  const [open, setOpen] = useState(false);
  const proceesedCode = processJsonEscapes(code);

  useEffect(() => {
    if (typeof code === 'string') {
      try {
        // 编码PlantUML代码
        const encoded = plantumlEncoder.encode(proceesedCode);
        // 使用公共PlantUML服务器生成图片URL
        const url = `https://www.plantuml.com/plantuml/png/${encoded}`;
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

  return (
    <div className="my-4 w-full overflow-hidden border border-gray-300 dark:border-gray-600">
      <div className="bg-custom-component flex items-center justify-between px-4 py-3 text-white shadow-md">
        <span className="px-2 py-1 text-sm font-bold">{title}</span>
        <div className="flex space-x-2">
          <button
            onClick={toggleShowCode}
            className="text-gray-200 transition-colors hover:text-white"
            title={showCode ? '隐藏代码' : '显示代码'}
          > 
            {showCode ? '隐藏代码' : '显示代码'}
          </button>
          <button
            onClick={copyToClipboard}
            className="text-gray-200 transition-colors hover:text-white"
            title="复制代码"
          >
            <Copy size={16} />
            <span className="sr-only">复制代码</span>
            {copied && (
              <span className="absolute right-0 top-0 bg-green-500 px-2 py-1 text-xs text-white">
                已复制!
              </span>
            )}
          </button>
        </div>
      </div>

      {showCode && (
        <div className="bg-[#f0e6d2] p-4">
          <pre className="whitespace-pre-wrap text-sm text-[#4a3f35]">
            {proceesedCode}
          </pre>
        </div>
      )}

      <div className="w-full bg-[#dbe8f0] p-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span>{proceesedCode}</span>
          </div>
        ) : imageUrl ? (
          <div className="flex w-full justify-center overflow-auto">
            <img
              src={imageUrl}
              alt={alt}
              className="w-full cursor-pointer"
              onClick={() => setOpen(true)}
              onError={() => console.error('PlantUML图片加载失败')}
            />
          </div>
        ) : (
          <div className="p-4 text-red-500">
            无法生成PlantUML图表，请检查语法是否正确。
          </div>
        )}
      </div>

      {/* 使用 yet-another-react-lightbox 显示图片 */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: imageUrl, alt: alt }]}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 8,
          zoomInMultiplier: 1.2,
          doubleTapDelay: 300,
        }}
        animation={{ swipe: 250 }}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </div>
  );
};

export default PlantUML;
