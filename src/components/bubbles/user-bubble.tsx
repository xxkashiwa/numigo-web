const UserBubble = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full justify-end">
      <div className="rounded-3xl bg-gray-200 p-2">{message}</div>
    </div>
  );
};
export default UserBubble;
