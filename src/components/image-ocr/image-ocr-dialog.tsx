// filepath: d:\workspace\proj\numigo-web\src\components\image-ocr\image-ocr-dialog.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ocrService } from '@/services/ocr-service';
import React, { useRef, useState } from 'react';

interface ImageOCRDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (text: string) => void;
}

export const ImageOCRDialog: React.FC<ImageOCRDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      // Convert the image to base64
      const base64 = await convertImageToBase64(file); // Send the base64 image to the OCR service
      const response = await ocrService(base64);
      // //   // Check if response has recognized text
      if (response) {
        // Pass the recognized text back to the parent component
        onSuccess(response);
        onClose();
      } else {
        throw new Error('OCR service returned no text');
      }
    } catch (error) {
      console.error('OCR processing failed:', error);
      setError('图片识别失败，请重试');
    } finally {
      setIsLoading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extract base64 data from the data URL
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>图片识别</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-muted-foreground">
            选择一张图片进行识别，支持常见图片格式
          </div>

          <Button
            onClick={handleSelectImage}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '选择图片'}
          </Button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
