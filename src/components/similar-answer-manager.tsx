'use client';

import { Pencil, Plus, Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

// Define types for similar answers
export interface SimilarAnswer {
  id: string;
  questionType: string;
  question: string;
  answer: string;
  feedback: 'helpful' | 'not-helpful' | null;
  similarity: number;
}

interface SimilarAnswerManagerProps {
  isOpen: boolean;
  onClose: () => void;
  similarAnswers: SimilarAnswer[];
  onSave: (answers: SimilarAnswer[]) => void;
}

export function SimilarAnswerManager({
  isOpen,
  onClose,
  similarAnswers,
  onSave,
}: SimilarAnswerManagerProps) {
  const [answers, setAnswers] = useState<SimilarAnswer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<SimilarAnswer | null>(
    null
  );

  // Stats
  const totalRecords = answers.length;
  const helpfulCount = answers.filter(a => a.feedback === 'helpful').length;
  const accuracy =
    totalRecords > 0 ? Math.round((helpfulCount / totalRecords) * 100) : 0;

  useEffect(() => {
    setAnswers(similarAnswers);
  }, [similarAnswers]);

  const handleAddNew = () => {
    setCurrentAnswer({
      id: '',
      questionType: '',
      question: '',
      answer: '',
      feedback: null,
      similarity: 50,
    });
    setIsEditing(true);
  };

  const handleEdit = (answer: SimilarAnswer) => {
    setCurrentAnswer({ ...answer });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setAnswers(answers.filter(a => a.id !== id));
  };

  const handleSaveAnswer = () => {
    if (!currentAnswer) return;

    if (currentAnswer.id) {
      // Update existing
      setAnswers(
        answers.map(a => (a.id === currentAnswer.id ? currentAnswer : a))
      );
    } else {
      // Add new
      const newAnswer = {
        ...currentAnswer,
        id: uuidv4(),
      };
      setAnswers([...answers, newAnswer]);
    }

    setIsEditing(false);
    setCurrentAnswer(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentAnswer(null);
  };

  const handleFieldChange = (field: keyof SimilarAnswer, value: any) => {
    if (!currentAnswer) return;
    setCurrentAnswer({
      ...currentAnswer,
      [field]: value,
    });
  };

  const handleSaveAll = () => {
    onSave(answers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-hidden bg-white sm:max-w-[600px] md:max-w-[800px]">
        {!isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                管理相似回答
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                已有 {totalRecords} 相似题型的回复记录, 准确率为 {accuracy}%
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] bg-white pr-4">
              <div className="flex flex-col gap-2 py-2">
                {answers.map(answer => (
                  <div
                    key={answer.id}
                    className="flex items-center justify-between border-b border-gray-100 py-2"
                  >
                    <div className="flex-1 truncate pr-4">
                      <span className="mr-2 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
                        {answer.questionType}
                      </span>
                      {answer.question}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(answer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(answer.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter className="flex items-center justify-between">
              <Button className="gap-1.5" onClick={handleAddNew}>
                <Plus className="h-4 w-4" />
                添加新问答
              </Button>
              <Button onClick={handleSaveAll}>保存全部更改</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-xl font-bold">
                {currentAnswer?.id ? '编辑问答' : '添加新问答'}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={handleCancel}
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="questionType">问题类型</Label>
                <Input
                  id="questionType"
                  value={currentAnswer?.questionType || ''}
                  onChange={e =>
                    handleFieldChange('questionType', e.target.value)
                  }
                  placeholder="例如：数学问题、物理问题等"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="question">问题</Label>
                <Input
                  id="question"
                  value={currentAnswer?.question || ''}
                  onChange={e => handleFieldChange('question', e.target.value)}
                  placeholder="输入问题内容"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="answer">答案</Label>
                <Textarea
                  id="answer"
                  value={currentAnswer?.answer || ''}
                  onChange={e => handleFieldChange('answer', e.target.value)}
                  placeholder="输入答案内容"
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feedback">反馈</Label>
                <Select
                  value={currentAnswer?.feedback || 'null'}
                  onValueChange={value =>
                    handleFieldChange(
                      'feedback',
                      value === 'null' ? null : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择反馈类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">未选择</SelectItem>
                    <SelectItem value="helpful">有帮助</SelectItem>
                    <SelectItem value="not-helpful">没帮助</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="similarity">
                  相似度：{currentAnswer?.similarity || 50}%
                </Label>
                <input
                  id="similarity"
                  type="range"
                  min="0"
                  max="100"
                  value={currentAnswer?.similarity || 50}
                  onChange={e =>
                    handleFieldChange('similarity', parseInt(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleSaveAnswer}>保存</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
