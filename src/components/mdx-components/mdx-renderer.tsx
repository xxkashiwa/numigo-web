/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import './mdx.css';
import PlantUML from './plantuml';
import PyResult from './py-result';
import Python from './python';
import './python-code.css';
interface MDXRendererProps {
  message: string;
  components?: Record<string, React.ComponentType<any>>;
}
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
    return <div>{message}</div>;
  }

  // 合并默认组件和自定义组件
  const allComponents = {
    Python,
    PlantUML,
    PyResult,
    p: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    ...components,
  };

  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={allComponents} />
    </div>
  );
};

export default MDXRenderer;
