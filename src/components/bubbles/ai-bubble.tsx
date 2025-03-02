import MarkdownRenderer from '../markdown-render';
const AiBubble = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full">
      <div className="w-full">
        <MarkdownRenderer markdown={message} />
      </div>
    </div>
  );
};
export default AiBubble;
