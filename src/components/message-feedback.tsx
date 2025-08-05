'use client';

import { useFeedbackStore } from '@/store/use-feedback-store';
import { Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface MessageFeedbackProps {
  messageId: number | string;
  onFeedback?: (
    messageId: number | string,
    type: 'like' | 'dislike' | null
  ) => void;
  onSimilarAnswer?: (messageId: number | string) => void;
}

export const MessageFeedback = ({
  messageId,
  onFeedback,
  onSimilarAnswer,
}: MessageFeedbackProps) => {
  const { setFeedback: storeFeedback, getFeedback } = useFeedbackStore();
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  // Load initial feedback from store
  useEffect(() => {
    const savedFeedback = getFeedback(messageId);
    setFeedback(savedFeedback);
  }, [messageId, getFeedback]);

  const handleFeedback = (type: 'like' | 'dislike') => {
    // If already selected this type, toggle it off
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    storeFeedback(messageId, newFeedback);
    if (onFeedback) {
      onFeedback(messageId, newFeedback);
    }
  };

  const handleSimilarAnswer = () => {
    if (onSimilarAnswer) {
      onSimilarAnswer(messageId);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 rounded-full p-1 ${
                feedback === 'like'
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-muted hover:text-muted-foreground'
              }`}
              onClick={() => handleFeedback('like')}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="sr-only">Like</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>有帮助</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 rounded-full p-1 ${
                feedback === 'dislike'
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-muted hover:text-muted-foreground'
              }`}
              onClick={() => handleFeedback('dislike')}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="sr-only">Dislike</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>没帮助</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-1 hover:bg-muted hover:text-muted-foreground"
              onClick={handleSimilarAnswer}
            >
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Similar Answers</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>相似回答</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
