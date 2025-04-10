/**
 * 将错误格式的LaTeX标记符号转换为正确格式
 * 将\[ 和 \]转换为$$（用于块级数学公式）
 * 将\( 和 \)转换为$（用于行内数学公式）
 * @param text 原始文本
 * @returns 转换后的文本
 */
const processWrongLatex = (text: string): string => {
  let result = text;

  // 将\[ 和 \]转换为$$（块级数学公式）
  result = result.replace(/\\\[/g, '$$');
  result = result.replace(/\\\]/g, '$$');

  // 将\( 和 \)转换为$（行内数学公式）
  result = result.replace(/\\\(/g, '$');
  result = result.replace(/\\\)/g, '$');

  return result;
};

export default processWrongLatex;
