import { cn } from '@/lib/utils';
import MDXRenderer from '../mdx-renderer';
const ModuleBubble = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div className={cn('rounded-3xl p-2', className)}>
      <div className="w-full">
        <MDXRenderer message={message} />
      </div>
    </div>
  );
};
export default ModuleBubble;
