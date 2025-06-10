import ErrorBoundary from '@/components/error-boundary';
import MDXRenderer from '@/components/mdx-components/mdx-renderer';
import { AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

interface MathPreviewProps {
  content: string;
}

const MathPreview = ({ content }: MathPreviewProps) => {
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Calculate the preview content
  const previewContent = useMemo(() => {
    if (!content.trim()) {
      setPreviewError(null);
      return '';
    }

    try {
      // Return the full content for MDX rendering
      setPreviewError(null);
      return content;
    } catch (error) {
      if (error instanceof Error) {
        setPreviewError(error.message.split('\n')[0]); // Only show first line of error
      } else {
        setPreviewError('Syntax error');
      }
      return '';
    }
  }, [content]);

  // Handle MDX rendering errors
  const handleMDXError = (error: Error) => {
    setPreviewError(error.message.split('\n')[0] || 'Syntax error');
  };

  return (
    <div className="mt-4 rounded-md border bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between text-sm font-medium">
        <span>内容预览</span>
        {previewError && (
          <div className="flex items-center text-xs text-red-500">
            <AlertCircle className="mr-1 h-3 w-3" />
            <span>Syntax error</span>
          </div>
        )}
      </div>
      <div className="max-h-48 overflow-y-auto rounded border bg-white p-3">
        {previewError ? (
          <div className="flex flex-col items-center">
            <div className="mb-1 text-sm text-red-500">渲染错误</div>
            <div className="max-w-full overflow-hidden text-ellipsis text-xs text-red-400">
              {previewError}
            </div>
          </div>
        ) : (
          <div className="w-full">
            {!previewContent ? (
              <span className="block py-4 text-center text-sm text-muted-foreground">
                输入内容后将显示预览
              </span>
            ) : (
              <div className="mdx-preview w-full">
                <ErrorBoundary onError={handleMDXError}>
                  <MDXRenderer message={previewContent} />
                </ErrorBoundary>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathPreview;
