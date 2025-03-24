'use client';
import { useModelStore } from '@/store/use-model-store';
import { useEffect } from 'react';

// 提供一个非Hook环境下获取当前模型的函数
export const getCurrentModel = () => {
  return useModelStore.getState().currentModel;
};

// 提供一个React Hook用于组件中使用
export const useModel = () => {
  const { currentModel, modelList, setCurrentModel } = useModelStore();

  // 可以在这里添加一些副作用，比如初始化逻辑
  useEffect(() => {
    // 这里可以添加一些初始化逻辑，如果需要的话
  }, []);

  return {
    currentModel,
    modelList,
    setCurrentModel,
  };
};
