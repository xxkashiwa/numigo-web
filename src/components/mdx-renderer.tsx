/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import 'katex/dist/katex.min.css';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

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
    return <div>Loading...</div>;
  }

  return <MDXRemote {...source} components={components} />;
};

export default MDXRenderer;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import 'katex/dist/katex.min.css';
// import { MDXRemote } from 'next-mdx-remote';
// import { serialize } from 'next-mdx-remote/serialize';
// import { useEffect, useState } from 'react';
// import Highlight from 'react-highlight';
// import rehypeKatex from 'rehype-katex';
// import remarkMath from 'remark-math';
// const PlantUML = (props: any) => {
//   // Remove any extra whitespace
//   const children = props.children;
//   console.log('plantuml children1: ', children);
//   // const content = children;
//   // const encoded = plantumlEncoder.encode(content);
//   // console.log('plantuml encoded: ', encoded);
//   // const src = `http://www.plantuml.com/plantuml/svg/${encoded}`;

//   return (
//     <div className="my-4">{/* <img src={src} alt="PlantUML Diagram" /> */}</div>
//   );
// };

// const Python = ({ children }: { children: string }) => {
//   // Ensure we're handling the content as plain text
//   console.log('Python children: ', children);

//   return (
//     <pre className="language-python">
//       <Highlight className="python">{children}</Highlight>
//     </pre>
//   );
// };
// const TestPage = () => {
//   const rawMdx = `
// ### 解题思路
// 题目给出的等式是 $2^8 = 4^x$。为了求解 $x$，我们首先需要将等号两边的底数统一。注意到 $4$ 可以表示为 $2^2$，因此原方程可以改写为：
// $$2^8 = (2^2)^x$$

// 根据指数法则 $(a^m)^n = a^{mn}$，上式可进一步简化为：
// $$2^8 = 2^{2x}$$

// 由于底数相同，我们可以直接比较指数部分，从而得到：
// $$8 = 2x$$

// 解这个简单的线性方程即可得到 $x$ 的值。

//   `;

//   const [source, setSource] = useState<any>(null);

//   useEffect(() => {
//     const serializeContent = async () => {
//       const serialized = await serialize(rawMdx, {
//         mdxOptions: {
//           remarkPlugins: [remarkMath],
//           rehypePlugins: [[rehypeKatex]],
//         },
//       });
//       setSource(serialized);

//       console.log('serialized: ', serialized);
//     };
//     serializeContent();
//   }, [rawMdx]);
//   const components = {
//     Python: Python,
//     PlantUML: PlantUML,
//   };

//   return (
//     <div className="flex h-full w-full p-10">
//       {source ? (
//         <div>
//           <MDXRemote {...source} components={components} />
//         </div>
//       ) : (
//         <div>Loading...</div>
//       )}
//     </div>
//   );
// };

// export default TestPage;
