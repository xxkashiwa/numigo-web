'use client';
import { NewChatButton, ShareButton, ToggleButton } from '@/components/buttons';
import LoginDialog from '@/components/dialogs/login-dialog';
import UserDialog from '@/components/dialogs/user-dialog';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useConversation } from '@/hooks/use-conversation';
import { useState } from 'react';
const Navbar = () => {
  const { open } = useSidebar();
  const { isAuthenticated } = useAuth();
  const {} = useConversation();
  return (
    <div className="sticky flex h-[3vh] w-full items-center justify-between">
      <div className="inline-flex gap-2">
        {open ? null : (
          <>
            <ToggleButton />
            <NewChatButton />
          </>
        )}
        <ModelSelector />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <ChatTitle />
      </div>
      <div className="inline-flex">
        <ShareButton />
        {isAuthenticated ? <UserDialog /> : <LoginDialog />}
      </div>
    </div>
  );
};
export default Navbar;

const ChatTitle = () => {
  const { chatTitle } = useConversation();
  const [title, setTitle] = useState(chatTitle);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <input
      placeholder="未命名对话"
      value={title}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="border-none outline-none"
    />
  );
};

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModelStore } from '@/store/use-model-store';

const ModelSelector = () => {
  const { modelList, setCurrentModel, currentModel } = useModelStore();
  return (
    <Select
      onValueChange={(value: string) => {
        setCurrentModel(value);
      }}
      value={currentModel}
    >
      <SelectTrigger className="w-[120px] border-none focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder="LLM 模型" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {modelList.map((model, index) => (
            <SelectItem value={model} key={index}>
              {model.toUpperCase() + ' 模型'}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
