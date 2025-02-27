'use client';
import { useState } from 'react';

import { useSidebar } from '@/components/ui/sidebar';
const Navbar = () => {
  const { open } = useSidebar();
  const isLogged = false;
  return (
    <div className="relative flex h-[3vh] w-full items-center justify-between">
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
        {isLogged ? <UserButton /> : <LoginButton />}
      </div>
    </div>
  );
};
export default Navbar;

const ChatTitle = () => {
  const [title, setTitle] = useState('');

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
  NewChatButton,
  ShareButton,
  ToggleButton,
  UserButton,
} from '@/components/buttons';
import LoginButton from '@/components/buttons/login-button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ModelEntry = {
  id: string;
  name: string;
};
const ModelSelector = () => {
  const models: ModelEntry[] = [
    { id: '1', name: '模型 1' },
    { id: '2', name: '模型 2' },
    { id: '3', name: '模型 3' },
  ];
  return (
    <Select>
      <SelectTrigger className="w-[120px] border-none focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder="模型1" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {models.map(model => (
            <SelectItem value={model.name} key={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
