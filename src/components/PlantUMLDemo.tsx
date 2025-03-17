'use client';

import MDXRenderer from './mdx-components/mdx-renderer';

const PlantUMLDemo = () => {
  // 包含PlantUML图表的MDX内容
  const mdxContent = `
# PlantUML图表示例

下面是一个简单的类图示例：

<PlantUML title="简单类图">
@startuml
class Car {
  - brand: String
  - model: String
  + start(): void
  + stop(): void
}

class Driver {
  - name: String
  - license: String
  + drive(car: Car): void
}

Driver --> Car : drives
@enduml
</PlantUML>

下面是一个序列图示例：

<PlantUML title="用户登录序列图">
@startuml
actor User
participant "Login Page" as Login
participant "Auth Service" as Auth
database "User Database" as DB

User -> Login: 输入用户名和密码
Login -> Auth: 验证凭据
Auth -> DB: 查询用户信息
DB --> Auth: 返回用户数据
Auth --> Login: 验证结果
Login --> User: 登录成功/失败消息
@enduml
</PlantUML>

你也可以创建活动图：

<PlantUML title="简单活动图">
@startuml
start
:初始化;
if (数据有效?) then (是)
  :处理数据;
else (否)
  :显示错误;
endif
:保存结果;
stop
@enduml
</PlantUML>
  `;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">PlantUML标签演示</h1>
      <div className="prose dark:prose-invert max-w-none">
        <MDXRenderer message={mdxContent} />
      </div>
    </div>
  );
};

export default PlantUMLDemo;
