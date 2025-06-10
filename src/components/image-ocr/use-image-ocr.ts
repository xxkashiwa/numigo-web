// filepath: d:\workspace\proj\numigo-web\src\components\image-ocr\use-image-ocr.ts
import { useState } from 'react';

export const useImageOCR = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
  };
};
