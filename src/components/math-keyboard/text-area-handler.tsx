import { RefObject, useEffect, useState } from 'react';

export interface CursorPosition {
  start: number;
  end: number;
}

export class TextAreaHandler {
  private textareaRef: RefObject<HTMLTextAreaElement | null> | null;
  private cachedTextarea: HTMLTextAreaElement | null = null;

  constructor(ref: RefObject<HTMLTextAreaElement | null> | null) {
    this.textareaRef = ref;
  }

  /**
   * Find and return the textarea element
   */
  findTextarea(): HTMLTextAreaElement | null {
    if (this.textareaRef?.current) {
      return this.textareaRef.current;
    }

    if (!this.cachedTextarea) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        this.cachedTextarea = textarea as HTMLTextAreaElement;
      }
    }

    return this.cachedTextarea;
  }

  /**
   * Insert text at current cursor position
   */
  insertText(
    text: string,
    inputText: string,
    cursorPos: CursorPosition | null,
    setInputText: (text: string) => void,
    setCursorPos: (pos: CursorPosition) => void
  ): void {
    const textarea = this.findTextarea();

    if (!textarea) return;

    // Get current cursor position
    let startPos = textarea.selectionStart;
    let endPos = textarea.selectionEnd;

    // Use stored position if textarea doesn't have focus
    if (document.activeElement !== textarea && cursorPos) {
      startPos = cursorPos.start;
      endPos = cursorPos.end;
    }

    // Handle selected text
    const selectedText = inputText.substring(startPos, endPos);
    let newText = text;
    let newCursorPos = startPos + newText.length;

    // Handle special cases for wrapping selected text
    if (
      selectedText &&
      (text === '\\sqrt{}' || text === '\\sqrt[3]{}' || text === '^{}')
    ) {
      newText = text.replace('{}', `{${selectedText}}`);
      newCursorPos = startPos + newText.length;
    } else if (text.includes('{}')) {
      // For expressions with {}, position cursor inside the braces
      const bracePos = text.indexOf('{}');
      newCursorPos = startPos + bracePos + 1;
    } else if (text === '$$\n\n$$') {
      // For display equation, position cursor in the middle
      newCursorPos = startPos + 3; // After first newline
    }

    // Create new text value
    const newValue =
      inputText.substring(0, startPos) +
      newText +
      (selectedText && !text.includes(selectedText)
        ? ''
        : inputText.substring(endPos));

    // Update input text
    setInputText(newValue);

    // Update cursor position
    setCursorPos({
      start: newCursorPos,
      end: newCursorPos,
    });

    // Set cursor position in textarea
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }

  /**
   * Wrap selected text in math delimiters
   */
  wrapSelectedInMath(
    inputText: string,
    cursorPos: CursorPosition | null,
    setInputText: (text: string) => void,
    setCursorPos: (pos: CursorPosition) => void
  ): void {
    const textarea = this.findTextarea();

    if (!textarea) return;

    // Get current cursor position
    let startPos = textarea.selectionStart;
    let endPos = textarea.selectionEnd;

    // Use stored position if textarea doesn't have focus
    if (document.activeElement !== textarea && cursorPos) {
      startPos = cursorPos.start;
      endPos = cursorPos.end;
    }

    // Get selected text
    const selectedText = inputText.substring(startPos, endPos);
    let newCursorPos: number;

    if (selectedText) {
      // Wrap selected text in dollar signs
      const newText = '$' + selectedText + '$';
      const newValue =
        inputText.substring(0, startPos) +
        newText +
        inputText.substring(endPos);

      setInputText(newValue);
      newCursorPos = startPos + newText.length;
    } else {
      // If no text selected, insert empty dollar signs and place cursor between them
      const newText = '$$';
      const newValue =
        inputText.substring(0, startPos) +
        newText +
        inputText.substring(endPos);

      setInputText(newValue);
      newCursorPos = startPos + 1;
    }

    // Update cursor position
    setCursorPos({
      start: newCursorPos,
      end: newCursorPos,
    });

    // Set cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }
}

/**
 * Hook to track cursor position in a textarea
 */
export const useCursorPosition = (
  textareaRef: RefObject<HTMLTextAreaElement | null> | null
) => {
  const [cursorPos, setCursorPos] = useState<CursorPosition | null>(null);
  const textAreaHandler = new TextAreaHandler(textareaRef);

  const handleTextareaSelect = () => {
    const textarea = textAreaHandler.findTextarea();
    if (textarea) {
      setCursorPos({
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      });
    }
  };

  // Set up event handlers to track cursor position
  useEffect(() => {
    const textarea = textAreaHandler.findTextarea();
    if (textarea) {
      textarea.addEventListener('focus', handleTextareaSelect);
      textarea.addEventListener('click', handleTextareaSelect);
      textarea.addEventListener('select', handleTextareaSelect);
      textarea.addEventListener('keyup', handleTextareaSelect);

      return () => {
        textarea.removeEventListener('focus', handleTextareaSelect);
        textarea.removeEventListener('click', handleTextareaSelect);
        textarea.removeEventListener('select', handleTextareaSelect);
        textarea.removeEventListener('keyup', handleTextareaSelect);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cursorPos, setCursorPos, textAreaHandler };
};
