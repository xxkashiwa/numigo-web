'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FeedbackType = 'like' | 'dislike' | null;

interface MessageFeedback {
  messageId: string;
  feedback: FeedbackType;
  timestamp: number;
}

interface FeedbackState {
  feedbacks: Record<string, MessageFeedback>;
  setFeedback: (messageId: string | number, feedback: FeedbackType) => void;
  getFeedback: (messageId: string | number) => FeedbackType;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedbacks: {},
      setFeedback: (messageId, feedback) => {
        const id = String(messageId);
        set(state => ({
          feedbacks: {
            ...state.feedbacks,
            [id]: {
              messageId: id,
              feedback,
              timestamp: Date.now(),
            },
          },
        }));
      },
      getFeedback: messageId => {
        const id = String(messageId);
        const feedback = get().feedbacks[id];
        return feedback ? feedback.feedback : null;
      },
    }),
    {
      name: 'message-feedback-storage',
    }
  )
);
