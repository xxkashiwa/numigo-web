import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MathPreview from './math-preview';
import mathSymbols, { MathSymbol } from './math-symbols';
import { CursorPosition, TextAreaHandler } from './text-area-handler';

interface MathKeyboardProps {
  inputText: string;
  onClose: () => void;
  textAreaHandler: TextAreaHandler;
  cursorPos: CursorPosition | null;
  setInputText: (text: string) => void;
  setCursorPos: (pos: CursorPosition) => void;
}

const MathKeyboard = ({
  inputText,
  onClose,
  textAreaHandler,
  cursorPos,
  setInputText,
  setCursorPos,
}: MathKeyboardProps) => {
  // Insert a math symbol at cursor position
  const insertMathSymbol = (latexCode: string) => {
    textAreaHandler.insertText(
      latexCode,
      inputText,
      cursorPos,
      setInputText,
      setCursorPos
    );
  };

  // Wrap selected text with dollar signs for math mode
  const wrapSelectedInMath = () => {
    textAreaHandler.wrapSelectedInMath(
      inputText,
      cursorPos,
      setInputText,
      setCursorPos
    );
  };

  // Render buttons for a specific category of symbols
  const renderSymbolButtons = (category: string) => {
    const symbols = mathSymbols.filter(item => item.category === category);
    return (
      <div className="flex flex-wrap gap-2 py-2">
        {symbols.map((item: MathSymbol, index: number) => (
          <Button
            key={index}
            variant="outline"
            className="h-10 w-10 text-base font-medium"
            onClick={() => {
              if (item.symbol === '$') {
                wrapSelectedInMath();
              } else {
                insertMathSymbol(item.latex);
              }
            }}
            title={item.tooltip || `插入 ${item.latex}`}
          >
            {item.symbol}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card className="absolute bottom-full z-50 mb-2 w-full bg-white shadow-lg">
      <CardContent className="p-4">
        <Tabs defaultValue="basic" className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="basic">基础运算</TabsTrigger>
              <TabsTrigger value="sets">集合</TabsTrigger>
              <TabsTrigger value="logic">逻辑</TabsTrigger>
              <TabsTrigger value="calculus">微积分</TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              className="text-sm"
              onClick={onClose}
              title="关闭键盘"
            >
              关闭键盘
            </Button>
          </div>

          <TabsContent value="basic">
            {renderSymbolButtons('basic')}
          </TabsContent>
          <TabsContent value="sets">{renderSymbolButtons('sets')}</TabsContent>
          <TabsContent value="logic">
            {renderSymbolButtons('logic')}
          </TabsContent>
          <TabsContent value="calculus">
            {renderSymbolButtons('calculus')}
          </TabsContent>

          {/* Common actions row */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => insertMathSymbol('$$\n\n$$')}
              title="插入行间公式"
            >
              插入行间公式 ($$...$$)
            </Button>
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => wrapSelectedInMath()}
              title="将选中文本转为行内公式"
            >
              行内公式 ($...$)
            </Button>
          </div>

          {/* Preview section */}
          <MathPreview content={inputText} />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MathKeyboard;
