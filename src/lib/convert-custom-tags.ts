/**
 * 将自定义标签转换为标准的MDX代码块格式
 * @param text 原始文本
 * @returns 转换后的文本
 */
const convertCustomTags = (text: string): string => {
  let result = text;

  // 辅助函数：转义代码中的特殊字符
  const escapeCodeContent = (code: string): string => {
    return code
      .trim()
      .replace(/'/g, "\\'") // 转义单引号
      .replace(/\\/g, '\\\\') // 转义反斜杠
      .replace(/\n/g, '\\n') // 转义换行符
      .replace(/\r/g, '\\r') // 转义回车符
      .replace(/\t/g, '\\t'); // 转义制表符
  };

  // 处理<Python>标签
  result = text.replace(
    /<Python(?:\s+title="([^"]*)")?(?:\s+showLineNumbers=\{(true|false)\})?>([\s\S]*?)<\/Python>/g,
    (_, title, showLineNumbers, code) => {
      const escapedCode = escapeCodeContent(code);
      return `<Python code='${escapedCode}'></Python>\n`;
    }
  );

  // 处理<PlantUML>标签
  result = result.replace(
    /<PlantUML(?:\s+title="([^"]*)")?(?:\s+alt="([^"]*)")?>([\s\S]*?)<\/PlantUML>/g,
    (_, title, alt, code) => {
      const escapedCode = escapeCodeContent(code);
      return `<PlantUML code='${escapedCode}'></PlantUML>\n`;
    }
  );

  // 处理<PyResult>标签
  result = result.replace(
    /<PyResult(?:\s+title="([^"]*)")?>([\s\S]*?)<\/PyResult>/g,
    (_, title, code) => {
      const escapedCode = escapeCodeContent(code);
      return `<PyResult code='${escapedCode}'></PyResult>\n`;
    }
  );

  return result;
};

export default convertCustomTags;
