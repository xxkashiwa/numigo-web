const UserBubble = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full justify-end">
      <p className="rounded-3xl bg-gray-200 p-2"> {message}</p>
    </div>
  );
};
export default UserBubble;
