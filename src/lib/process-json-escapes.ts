/**
 * 处理JSON字符串中的转义字符
 * @param text 原始文本
 * @returns 处理后的文本
 */
const processJsonEscapes = (text: string): string => {
  try {
    // 尝试将文本作为JSON字符串进行解析
    // 这会自动处理所有的转义字符
    // 注意：需要在文本外面加上引号，使其成为有效的JSON字符串
    const parsed = JSON.parse(`"${text.replace(/"/g, '\\"')}"`);
    return parsed;
  } catch (error) {
    // 如果解析失败，回退到简单的替换方法
    // console.log('JSON解析失败，回退到简单替换:', error);

    // 简单替换常见的转义序列
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  }
};

export default processJsonEscapes;
