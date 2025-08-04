import { Button } from '@/components/ui/button';
import { useConversation } from '@/hooks/use-conversation';
import { Sender } from '@ant-design/x';
import { ImageIcon, Keyboard } from 'lucide-react';
import { useRef, useState } from 'react';
import { ImageOCRDialog } from './image-ocr/image-ocr-dialog';
import { useImageOCR } from './image-ocr/use-image-ocr';
import { MathKeyboard, useCursorPosition } from './math-keyboard';
import './math-keyboard.css';

/**
 * AppSender Component
 *
 * Renders the input area with math keyboard functionality
 */
const AppSender = () => {
  // State and hook initialization
  const [inputText, setInputText] = useState('');
  const [showMathKeyboard, setShowMathKeyboard] = useState(false);
  const { isLoading, sendMessage } = useConversation();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { isDialogOpen, openDialog, closeDialog } = useImageOCR();

  // Use the cursor position hook to track cursor position in textarea
  const { cursorPos, setCursorPos, textAreaHandler } =
    useCursorPosition(textareaRef);

  /**
   * Handle message submission
   */
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Clear input and send message
    setInputText('');
    await sendMessage(inputText);

    // Redirect to chat page if not already there
    if (!window.location.pathname.includes('/chat')) {
      window.location.href = '/chat';
    }

    // Reset textarea height
    const textarea = textAreaHandler.findTextarea();
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };
  /**
   * Toggle the math keyboard visibility
   */
  const toggleMathKeyboard = () => {
    setShowMathKeyboard(!showMathKeyboard);
  };
  /**
   * Handle OCR result text
   */
  const handleOCRSuccess = (text: string) => {
    // Insert the OCR text into the input at the cursor position
    if (textAreaHandler && typeof text === 'string') {
      const currentPos = cursorPos?.start ?? 0;
      const newText =
        inputText.substring(0, currentPos) +
        text +
        inputText.substring(currentPos);

      setInputText(newText);
      // Update cursor position to be after the inserted text
      const newCursorPos = currentPos + text.length;
      setTimeout(() => {
        setCursorPos({
          start: newCursorPos,
          end: newCursorPos,
        });
      }, 0);
    }
  };
  return (
    <div className="relative">
      {/* Math keyboard component (only shown when toggled) */}
      {showMathKeyboard && (
        <MathKeyboard
          inputText={inputText}
          onClose={toggleMathKeyboard}
          textAreaHandler={textAreaHandler}
          cursorPos={cursorPos}
          setInputText={setInputText}
          setCursorPos={setCursorPos}
        />
      )}

      {/* Image OCR Dialog */}
      <ImageOCRDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSuccess={handleOCRSuccess}
      />

      <div className="flex flex-col">
        {/* Message input area */}
        <Sender
          loading={isLoading}
          value={inputText}
          onChange={v => {
            setInputText(v);
          }}
          onSubmit={handleSendMessage}
          autoSize={{ minRows: 2, maxRows: 6 }}
        />

        <div className="mt-2 flex justify-start space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openDialog}
            title="图片识别"
            className="navi-item flex items-center gap-1"
          >
            <ImageIcon className="h-4 w-4" />
            <span>图片识别</span>
          </Button>
          <Button
            type="button"
            variant={showMathKeyboard ? 'default' : 'outline'}
            size="sm"
            onClick={toggleMathKeyboard}
            title={showMathKeyboard ? '关闭数学键盘' : '打开数学键盘'}
            className="navi-item flex items-center gap-1"
          >
            <Keyboard className="h-4 w-4" />
            <span>数学键盘</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSender;
