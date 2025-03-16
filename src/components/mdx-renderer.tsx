/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import './python-code.css';

interface MDXRendererProps {
  message: string;
  components?: Record<string, React.ComponentType<any>>;
}

const Python = () => {
  return <div>Python</div>;
};
// /**
//  * Python代码块组件
//  * @param children - 代码内容
//  * @param showLineNumbers - 是否显示行号
//  * @param title - 代码块标题
//  */
// const Python = ({
//   children,
//   showLineNumbers = true,
//   title = 'Python',
// }: {
//   children: string;
//   showLineNumbers?: boolean;
//   title?: string;
// }) => {
//   const [copied, setCopied] = useState(false);

//   // 复制代码到剪贴板
//   const copyToClipboard = () => {
//     if (typeof children === 'string') {
//       navigator.clipboard.writeText(children);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   // 生成行号
//   const renderLineNumbers = () => {
//     if (!showLineNumbers) return null;

//     const lines = children.split('\n');
//     return (
//       <div className="line-numbers select-none pr-4 text-right text-gray-500">
//         {lines.map((_, i) => (
//           <div key={i} className="line-number">
//             {i + 1}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="my-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
//       <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-white">
//         <span className="text-sm">{title}</span>
//         <button
//           onClick={copyToClipboard}
//           className="text-gray-300 transition-colors hover:text-white"
//           title="复制代码"
//         >
//           <Copy size={16} />
//           <span className="sr-only">复制代码</span>
//           {copied && (
//             <span className="absolute right-0 top-0 rounded bg-green-500 px-2 py-1 text-xs text-white">
//               已复制!
//             </span>
//           )}
//         </button>
//       </div>
//       <div className="relative">
//         <div className="flex overflow-x-auto">
//           {showLineNumbers && renderLineNumbers()}
//           <Highlight className="python w-full">{children}</Highlight>
//         </div>
//       </div>
//     </div>
//   );
// };

const PlantUML = () => {
  return <div>PlantUML</div>;
};
// /**
//  * PlantUML图表组件
//  * @param children - PlantUML代码内容
//  * @param title - 图表标题
//  * @param alt - 图片alt文本
//  */
// const PlantUML = ({
//   children,
//   title = 'PlantUML图表',
//   alt = 'PlantUML图表',
// }: {
//   children: string;
//   title?: string;
//   alt?: string;
// }) => {
//   const [copied, setCopied] = useState(false);
//   const [imageUrl, setImageUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCode, setShowCode] = useState(false);

//   useEffect(() => {
//     if (typeof children === 'string') {
//       try {
//         // 编码PlantUML代码
//         const encoded = plantumlEncoder.encode(children);
//         // 使用公共PlantUML服务器生成图片URL
//         const url = `https://www.plantuml.com/plantuml/img/${encoded}`;
//         setImageUrl(url);
//       } catch (error) {
//         console.error('PlantUML编码错误:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }, [children]);

//   // 复制代码到剪贴板
//   const copyToClipboard = () => {
//     if (typeof children === 'string') {
//       navigator.clipboard.writeText(children);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   // 切换显示代码
//   const toggleShowCode = () => {
//     setShowCode(!showCode);
//   };

//   return (
//     <div className="my-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
//       <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-white">
//         <span className="text-sm">{title}</span>
//         <div className="flex space-x-2">
//           <button
//             onClick={toggleShowCode}
//             className="text-gray-300 transition-colors hover:text-white"
//             title={showCode ? '隐藏代码' : '显示代码'}
//           >
//             {showCode ? '隐藏代码' : '显示代码'}
//           </button>
//           <button
//             onClick={copyToClipboard}
//             className="text-gray-300 transition-colors hover:text-white"
//             title="复制代码"
//           >
//             <Copy size={16} />
//             <span className="sr-only">复制代码</span>
//             {copied && (
//               <span className="absolute right-0 top-0 rounded bg-green-500 px-2 py-1 text-xs text-white">
//                 已复制!
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {showCode && (
//         <div className="bg-gray-100 p-4 dark:bg-gray-800">
//           <pre className="whitespace-pre-wrap text-sm">{children}</pre>
//         </div>
//       )}

//       <div className="bg-white p-4 dark:bg-gray-900">
//         {isLoading ? (
//           <div className="flex h-32 items-center justify-center">
//             <span>加载图表中...</span>
//           </div>
//         ) : imageUrl ? (
//           <div className="flex justify-center">
//             <img
//               src={imageUrl}
//               alt={alt}
//               className="max-w-full"
//               onError={() => console.error('PlantUML图片加载失败')}
//             />
//           </div>
//         ) : (
//           <div className="p-4 text-red-500">
//             无法生成PlantUML图表，请检查语法是否正确。
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

/**
 * MDX渲染组件，用于将字符串解析为MDX内容并渲染
 * @param message - 要渲染的MDX格式字符串
 * @param components - 自定义组件映射（可选）
 */
const MDXRenderer = ({ message, components = {} }: MDXRendererProps) => {
  const [source, setSource] = useState<any>(null);

  useEffect(() => {
    const serializeContent = async () => {
      const serialized = await serialize(message, {
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [[rehypeKatex]],
        },
      });
      setSource(serialized);
    };
    serializeContent();
  }, [message]);

  if (!source) {
    return <div>Loading...</div>;
  }

  // 合并默认组件和自定义组件
  const allComponents = {
    Python,
    PlantUML,
    ...components,
  };

  return <MDXRemote {...source} components={allComponents} />;
};

export default MDXRenderer;
