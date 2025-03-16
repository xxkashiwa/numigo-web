'use client';

import MDXRenderer from './mdx-renderer';

const PythonDemo = () => {
  // 包含Python代码块的MDX内容
  const mdxContent =
    ' 当然可以！我可以展示一些基本的数学能力和更复杂的数学问题解决方法。为了更好地满足你的需求，请告诉我你希望解决的具体数学问题或类型。以下是一些常见的数学问题示例：\n\n1. **基础算术**：加法、减法、乘法、除法。\n2. **代数**：解方程、多项式操作。\n3. **几何**：计算面积、体积、角度等。\n4. **微积分**：导数、积分、极限。\n5. **概率与统计**：概率计算、数据分布、假设检验。\n\n请告诉我你感兴趣的具体问题或领域，我将为你展示如何解决它。如果你不确定，我可以从一个简单的例子开始。例如，我们可以从解一个一元二次方程开始。\n\n### 解一元二次方程\n假设我们有一个一元二次方程 $ax^2 + bx + c = 0$，我们需要找到它的根。根据韦达定理，方程的根可以通过以下公式计算：\n$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$\n\n### 思路\n1. **定义变量**：我们需要定义系数 $a$、$b$ 和 $c$。\n2. **计算判别式**：$\\Delta = b^2 - 4ac$。\n3. **判断根的情况**：\n   - 如果 $\\Delta > 0$，方程有两个不同的实根。\n   - 如果 $\\Delta = 0$，方程有一个重根。\n   - 如果 $\\Delta < 0$，方程有两个复根。\n4. **计算根**：根据判别式的值，计算相应的根。\n\n### PlantUML 图\n ';
  return (
    <div className="container mx-auto p-4">
      {' '}
      <h1 className="mb-4 text-2xl font-bold">Python标签演示</h1>{' '}
      <div className="prose dark:prose-invert max-w-none">
        <MDXRenderer message={mdxContent} />
      </div>
    </div>
  );
};

export default PythonDemo;
