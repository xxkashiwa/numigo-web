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
  const rawMdx = `"problem": "If $\\displaystyle \\left(\\frac{3}{4}\\right)^x=\\frac{81}{256}$, what must $x$ be?", "translated_problem": "如果 $\\left(\\frac{3}{4}\\right)^x = \\frac{81}{256}$，那么 $x$ 必须是多少？", "level": "Level 1", "type": "Algebra", "solution": "Remembering that $\\left(\\frac{a}{b}\\right)^n=\\frac{a^n}{b^n}$, we have $$ \\left(\\frac{3}{4}\\right)^x=\\frac{3^x}{4^x}=\\frac{81}{256}$$Comparing numerators, $3^x=81$ so $x=4$.\n\nIndeed, for the denominators we have $4^x=4^4=256$, as desired. Thus, $x=\\boxed{4}$."`;

  const [source, setSource] = useState<any>(null);

  useEffect(() => {
    const serializeContent = async () => {
      const serialized = await serialize(rawMdx, {
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [[rehypeKatex]],
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
        <div>
          <MDXRemote {...source} components={components} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TestPage;
