import MarkdownRenderer from '../markdown-render';
const UserBubble = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full justify-end">
      <div className="rounded-3xl bg-gray-200 p-2">
        <MarkdownRenderer markdown={message} />
      </div>
    </div>
  );
};
export default UserBubble;
