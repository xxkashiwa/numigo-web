# MDX 自定义标签组件

这个组件库允许在MDX内容中使用自定义标签来渲染特殊内容，如Python代码块和PlantUML图表。

## Python代码块

在MDX内容中，你可以使用`<Python>`标签来包裹Python代码：

```mdx
<Python>def hello_world(): print("Hello, World!")</Python>
```

### 支持的属性

`<Python>`标签支持以下属性：

- `title`: 代码块的标题，默认为"Python"
- `showLineNumbers`: 是否显示行号，默认为true

示例：

```mdx
<Python title="自定义标题" showLineNumbers={false}>
  # 这是一个没有行号的Python代码块 for i in range(5): print(i)
</Python>
```

## PlantUML图表

在MDX内容中，你可以使用`<PlantUML>`标签来创建UML图表：

```mdx
<PlantUML>
@startuml
class Example {
  + method(): void
}
@enduml
</PlantUML>
```

### 支持的属性

`<PlantUML>`标签支持以下属性：

- `title`: 图表的标题，默认为"PlantUML图表"
- `alt`: 图片的alt文本，用于无障碍访问，默认为"PlantUML图表"

示例：

```mdx
<PlantUML title="类图示例" alt="一个简单的类图">
@startuml
class User {
  - name: String
  + getName(): String
}
@enduml
</PlantUML>
```

### PlantUML语法

PlantUML支持多种图表类型，包括：

- 类图
- 序列图
- 活动图
- 状态图
- 组件图
- 对象图
- 部署图
- 时序图

每种图表都有其特定的语法。请参考[PlantUML官方文档](https://plantuml.com/zh/)获取更多信息。

## 在组件中使用

```tsx
import MDXRenderer from './mdx-renderer';

const MyComponent = () => {
  const mdxContent = `
# 示例

<Python>
def example():
    return "This is an example"
</Python>

<PlantUML>
@startuml
Bob -> Alice : hello
@enduml
</PlantUML>
  `;

  return <MDXRenderer message={mdxContent} />;
};
```

## 自定义样式

组件的样式定义在相应的CSS文件中，你可以根据需要修改这些样式。
