import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';

const md = new MarkdownIt().use(markdownItKatex, {
  throwOnError: false,
  errorColor: '#cc0000',
});

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{ __html: renderedHTML }} />;
};

export default MarkdownRenderer;
