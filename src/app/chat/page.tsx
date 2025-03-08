'use client';
import dialog from '@/assets/dialog1.json';
import AiBubble from '@/components/bubbles/ai-bubble';
import UserBubble from '@/components/bubbles/user-bubble';
import InputBox from '@/components/inputbox';
interface Dialog {
  sender: string;
  message: string;
}
const ChatPage = () => {
  const logs = dialog.log as Dialog[];

  return (
    <div className="flex h-[95vh] w-full flex-col items-center justify-between">
      <div className="flex w-full flex-grow overflow-auto">
        <div className="flex w-full flex-col items-center overflow-y-auto">
          <div className="w-full md:max-w-3xl">
            {logs.map((log, index) => {
              if (index >= 10) return;
              return log.sender === 'user' ? (
                <>
                  <UserBubble message={log.message} key={index} />
                </>
              ) : (
                <>
                  <AiBubble message={log.message} key={index} />
                </>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center pt-2">
        <div className="w-full md:max-w-3xl">
          <InputBox />
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
