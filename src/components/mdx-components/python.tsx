import { Copy } from 'lucide-react';
import { useState } from 'react';

import processJsonEscapes from '@/lib/process-json-escapes';
import Highlight from 'react-highlight';
/**
 * Python代码块组件
 * @param children - 代码内容
 * @param showLineNumbers - 是否显示行号
 * @param title - 代码块标题
 */
const Python = ({
  code,
  showLineNumbers = true,
  title = 'Python',
}: {
  code: string;
  showLineNumbers?: boolean;
  title?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const proceesedCode = processJsonEscapes(code);
  // 复制代码到剪贴板
  const copyToClipboard = () => {
    if (typeof code === 'string') {
      navigator.clipboard.writeText(proceesedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 生成行号
  const renderLineNumbers = () => {
    if (!showLineNumbers) return null;

    const lines = proceesedCode.split('\n');
    return (
      <div className="line-numbers select-none pr-4 text-right text-gray-500">
        {lines.map((_, i) => (
          <div key={i} className="line-number">
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-white">
        <span className="text-sm font-bold">{title}</span>
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
      <div className="relative overflow-x-hidden">
        <div className="flex overflow-x-auto">
          {showLineNumbers && renderLineNumbers()}
          <Highlight className="python w-full">{proceesedCode}</Highlight>
        </div>
      </div>
    </div>
  );
};

export default Python;
