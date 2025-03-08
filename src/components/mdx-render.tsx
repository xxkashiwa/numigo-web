/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const components = {
  python: PythonCode,
  mermaid: MermaidChart,
};

// 接受序列化的source或原始内容字符串
export default function MDXRenderer({
  source,
  content,
}: {
  source?: any;
  content?: string;
}) {
  const [mdxSource, setMdxSource] = useState(source);

  useEffect(() => {
    // 如果提供了content而不是source，在客户端序列化它
    if (!source && content) {
      const serializeContent = async () => {
        const serialized = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        });
        setMdxSource(serialized);
      };

      serializeContent();
    }
  }, [content, source]);

  if (!mdxSource) return <div>Loading...</div>;

  return (
    <div>
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}

function PythonCode({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-md bg-gray-100 p-4">
      <pre className="text-sm text-gray-800">{children}</pre>
    </div>
  );
}

import mermaid from 'mermaid';
import { useRef } from 'react';

function MermaidChart({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
      });

      // 清除之前的内容
      ref.current.innerHTML = '';

      // 异步渲染图表
      const renderChart = async () => {
        if (ref.current) {
          const { svg } = await mermaid.render('mermaid-svg', children);
          ref.current.innerHTML = svg;
        }
      };

      renderChart();
    }
  }, [children]);

  return <div className="my-4" ref={ref} />;
}
