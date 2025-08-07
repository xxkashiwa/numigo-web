'use client';

import { useFeedbackStore } from '@/store/use-feedback-store';
import { Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SimilarAnswersDialog } from './similar-answers-dialog';
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

// Sample data for all similar answers across the app
export const sampleSimilarAnswers = [
  {
    id: '1',
    questionType: '数学问题',
    question: '如何计算圆的面积？',
    answer:
      '圆的面积公式是 A = πr²，其中 r 是圆的半径。\n\n例如，如果圆的半径是 5 厘米，那么面积就是 A = 3.14159 × 5² = 3.14159 × 25 ≈ 78.54 平方厘米。',
    feedback: 'helpful' as const,
    similarity: 95,
  },
  {
    id: '2',
    questionType: '物理问题',
    question: '牛顿第二定律是什么？',
    answer:
      '牛顿第二定律表明，物体的加速度与所受的力成正比，与质量成反比。可以用公式 F = ma 表示，其中 F 是力，m 是质量，a 是加速度。',
    feedback: 'helpful' as const,
    similarity: 88,
  },
  {
    id: '3',
    questionType: '编程问题',
    question: '如何在JavaScript中创建一个函数？',
    answer:
      '在JavaScript中创建函数有几种方式：\n\n1. 函数声明：\nfunction myFunction(params) {\n  // 代码块\n  return result;\n}\n\n2. 函数表达式：\nconst myFunction = function(params) {\n  // 代码块\n  return result;\n}\n\n3. 箭头函数：\nconst myFunction = (params) => {\n  // 代码块\n  return result;\n}',
    feedback: 'not-helpful' as const,
    similarity: 75,
  },
];

export const MessageFeedback = ({
  messageId,
  onFeedback,
  onSimilarAnswer,
}: MessageFeedbackProps) => {
  const { setFeedback: storeFeedback, getFeedback } = useFeedbackStore();
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [showSimilarAnswers, setShowSimilarAnswers] = useState(false);

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
    setShowSimilarAnswers(true);
    if (onSimilarAnswer) {
      onSimilarAnswer(messageId);
    }
  };

  return (
    <>
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

      <SimilarAnswersDialog
        isOpen={showSimilarAnswers}
        onClose={() => setShowSimilarAnswers(false)}
        similarAnswers={sampleSimilarAnswers}
        totalRecords={0} // Will be calculated automatically
        accuracy={0} // Will be calculated automatically
      />
    </>
  );
};
