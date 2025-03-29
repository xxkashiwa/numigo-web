import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModelState {
  currentModel: string;
  modelList: string[];
  setCurrentModel: (value: string) => void;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      currentModel: 'tir',
      modelList: ['tir', 'cot', 'tot'],
      setCurrentModel: (value: string) => {
        const index = get().modelList.findIndex(item => item === value);
        if (index < 0) return;
        set({ currentModel: value });
      },
    }),
    {
      name: 'model-store',
      partialize: state => ({ currentModel: state.currentModel }),
    }
  )
);
