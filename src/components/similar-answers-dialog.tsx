'use client';

import { useState } from 'react';
import {
  SimilarAnswerManager,
  SimilarAnswer as SimilarAnswerType,
} from './similar-answer-manager';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

// Export the type so we can use it elsewhere
export type { SimilarAnswerType as SimilarAnswer };

interface SimilarAnswer {
  id: string;
  questionType: string;
  question: string;
  answer: string;
  feedback: 'helpful' | 'not-helpful' | null;
  similarity: number; // percentage of similarity
}

interface SimilarAnswersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  similarAnswers: SimilarAnswer[];
  totalRecords: number;
  accuracy: number;
}

export function SimilarAnswersDialog({
  isOpen,
  onClose,
  similarAnswers,
  totalRecords,
  accuracy,
}: SimilarAnswersDialogProps) {
  const [showManager, setShowManager] = useState(false);
  const [answers, setAnswers] = useState<SimilarAnswer[]>(similarAnswers);

  // Calculate stats automatically
  const calculatedTotalRecords = answers.length;
  const helpfulCount = answers.filter(a => a.feedback === 'helpful').length;
  const calculatedAccuracy =
    calculatedTotalRecords > 0
      ? Math.round((helpfulCount / calculatedTotalRecords) * 100)
      : 0;

  // Use either provided values or calculated ones
  const displayTotal = totalRecords || calculatedTotalRecords;
  const displayAccuracy = accuracy || calculatedAccuracy;

  const handleTitleClick = () => {
    setShowManager(true);
  };

  const handleSaveAnswers = (updatedAnswers: SimilarAnswer[]) => {
    setAnswers(updatedAnswers);
    // Here you would typically save to a database or state management
    console.log('Saved answers:', updatedAnswers);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[80vh] overflow-hidden bg-white sm:max-w-[600px] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle
              className="cursor-pointer text-xl font-bold"
              onClick={handleTitleClick}
            >
              相似回答
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              已有 {displayTotal} 相似题型的回复记录, 准确率为 {displayAccuracy}
              %
            </p>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] bg-white pr-4">
            <div className="flex flex-col gap-4 py-2">
              {answers.map(item => (
                <Card key={item.id} className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant="outline"
                        className="w-fit bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {item.questionType}
                      </Badge>
                      <h3 className="font-semibold">{item.question}</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="whitespace-pre-wrap text-sm">
                        {item.answer}
                      </div>
                      <div className="flex justify-end">
                        <Badge
                          className={
                            item.feedback === 'helpful'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        >
                          {item.feedback === 'helpful' ? '有帮助' : '没帮助'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Hidden Manager Dialog */}
      <SimilarAnswerManager
        isOpen={showManager}
        onClose={() => setShowManager(false)}
        similarAnswers={answers}
        onSave={handleSaveAnswers}
      />
    </>
  );
}
