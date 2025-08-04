'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { useConversation } from '@/hooks/use-conversation';
import { createConversation } from '@/services/conversation';
const NewChatButton = () => {
  const { setCurrentConversationId, setChatTitle } = useConversation();
  const newChat = async () => {
    const response = await createConversation({ title: '未使用对话' });
    setChatTitle('未使用对话');
    const newId = response.data.id;
    setCurrentConversationId(newId);
  };

  return (
    <button className="navi-item gap-2" onClick={newChat}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-5 w-5 fill-white"
      >
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
      </svg>
      <span className="font-medium">新建对话</span>
    </button>
  );
};

const ToggleButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="navi-item"
      onClick={() => {
        toggleSidebar();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-5 w-5 fill-white"
      >
        <path d="M186.01-96.75q-37.58 0-63.42-25.84-25.84-25.84-25.84-63.42v-587.98q0-37.64 25.84-63.53t63.42-25.89h587.98q37.64 0 63.53 25.89t25.89 63.53v587.98q0 37.58-25.89 63.42-25.89 25.84-63.53 25.84H186.01Zm134.02-89.26v-587.98H186.01v587.98h134.02Zm89.42 0h364.54v-587.98H409.45v587.98Zm-89.42 0H186.01h134.02Z" />
      </svg>
    </button>
  );
};

const UserButton = () => {
  return (
    <button className="h-full w-9 rounded-xl bg-[var(--blue-color)] bg-opacity-0 p-1 transition-all duration-300 hover:bg-opacity-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full"
      >
        <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
      </svg>
    </button>
  );
};

export { NewChatButton, ToggleButton, UserButton };
