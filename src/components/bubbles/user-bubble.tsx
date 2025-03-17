import { cn } from '@/lib/utils';
import MDXRenderer from '../mdx-components/mdx-renderer';
const UserBubble = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full justify-end', className)}>
      <div className="rounded-3xl bg-gray-200 p-2">
        <MDXRenderer message={message} />
      </div>
    </div>
  );
};
export default UserBubble;
