/* eslint-disable @next/next/no-img-element */
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import plantumlEncoder from 'plantuml-encoder';
import { useEffect, useState } from 'react';
import rehypeKatex from 'rehype-katex'; // 添加这一行
import remarkMath from 'remark-math';
const Plantuml = ({ children }: { children: any }) => {
  // Remove any extra whitespace
  console.log('plantuml children1: ', children);
  const content = children.trim();
  const encoded = plantumlEncoder.encode(content);
  const src = `http://www.plantuml.com/plantuml/svg/${encoded}`;

  return (
    <div className="my-4">
      <img src={src} alt="PlantUML Diagram" />
    </div>
  );
};

const Python = ({ children }: { children: string }) => {
  console.log('python children: ', children);
  return (
    <div className="my-4 rounded-md bg-gray-800 p-4 font-mono text-white">
      <div className="mb-2 flex items-center">
        <div className="rounded bg-blue-500 px-2 py-1 text-xs">Python</div>
      </div>
      <div>{children}</div>
    </div>
  );
};
const TestPage = () => {
  const rawMdx = `$$ \\frac{z}{2y} = 4 \\Rightarrow z = 8y $$ <Python>print('hello world')</Python>\n 
 <Plantuml>@startuml\nstart\n:确定初始条件: 3英里喝1.5品脱;\n:计算喝水速率: 每英里消耗水量 = 1.5 / 3;\n:应用速率到后续距离: 下10英里的总消耗量 = 10 * 每英里消耗水量;\n:输出结果: 总消耗量为5品脱;\nstop\n@enduml</Plantuml>\n
  `;

  const [source, setSource] = useState<any>(null);

  useEffect(() => {
    const serializeContent = async () => {
      const serialized = await serialize(rawMdx, {
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      });
      setSource(serialized);
      console.log('serialized: ', serialized);
    };
    serializeContent();
  }, [rawMdx]);
  const components = {
    Python: Python,
    Plantuml: Plantuml,
  };

  return (
    <div className="flex h-full w-full p-10">
      {source ? (
        <MDXRemote {...source} components={components} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TestPage;
