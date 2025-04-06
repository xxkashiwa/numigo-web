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
    return (
      // <Card className="my-4 border-destructive bg-destructive/10">
      //   <CardHeader className="pb-2">
      //     <div className="flex items-center gap-2">
      //       <AlertTriangle className="h-5 w-5 text-destructive" />
      //       <CardTitle className="text-destructive">渲染失败</CardTitle>
      //     </div>
      //   </CardHeader>
      //   <CardContent>
      //     <CardDescription className="whitespace-pre-wrap text-destructive/90">
      //       {message}
      //     </CardDescription>
      //   </CardContent>
      //   <CardFooter className="pt-0">
      //     <p className="rounded-xl bg-green-300 p-2 text-sm font-medium text-blue-600">
      //       请向开发人员反馈
      //     </p>
      //   </CardFooter>
      // </Card>
      <div>{message}</div>
    );
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
