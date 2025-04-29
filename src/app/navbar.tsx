'use client';
import { NewChatButton, ToggleButton } from '@/components/buttons';
import UserDialog from '@/components/dialogs/user-dialog';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useConversation } from '@/hooks/use-conversation';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { open } = useSidebar();
  const { isAuthenticated } = useAuth();
  const {} = useConversation();
  const router = useRouter();

  return (
    <div className="sticky flex w-full items-center justify-between border-b border-primary/20 bg-background">
      <div className="inline-flex h-full items-center gap-2">
        {open ? null : (
          <>
            <ToggleButton />
            <NewChatButton />
          </>
        )}
        <ModelSelector />
      </div>

      <div className="inline-flex">
        {isAuthenticated ? (
          <UserDialog />
        ) : (
          <button
            className="flex items-center gap-2 rounded-lg bg-gray-100 bg-opacity-50 p-2 shadow-md transition-all duration-300 hover:bg-gray-200"
            onClick={() => router.push('/login')}
          >
            <NoAccountIcon />
          </button>
        )}
      </div>
    </div>
  );
};
export default Navbar;

// const ChatTitle = () => {
//   const { chatTitle } = useConversation();
//   const [title, setTitle] = useState(chatTitle);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       e.currentTarget.blur();
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTitle(e.target.value);
//   };

//   return (
//     <input
//       placeholder="未命名对话"
//       value={title}
//       onChange={handleChange}
//       onKeyDown={handleKeyDown}
//       className="border-none outline-none"
//     />
//   );
// };

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModelStore } from '@/store/use-model-store';
import { Brain, FlaskConical, Lightbulb, Settings } from 'lucide-react';

const ModelSelector = () => {
  const { modelList, setCurrentModel, currentModel } = useModelStore();

  // Get icon based on model name
  const getModelIcon = (model: string) => {
    switch (model) {
      case 'tot':
        return <Brain className="mr-2 h-4 w-4" />;
      case 'cot':
        return <FlaskConical className="mr-2 h-4 w-4" />;
      case 'tir':
        return <Lightbulb className="mr-2 h-4 w-4" />;
      default:
        return <Settings className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Select
      onValueChange={(value: string) => {
        setCurrentModel(value);
      }}
      value={currentModel}
    >
      <SelectTrigger className="w-[160px] rounded-lg bg-gray-200 bg-opacity-50 p-2 shadow-md transition-all duration-300 hover:bg-gray-200 focus:ring-0">
        <div className="flex items-center">
          <SelectValue placeholder="Select Model" />
        </div>
      </SelectTrigger>
      <SelectContent className="backdrop-blur-sm">
        <SelectGroup>
          {modelList.map((model, index) => (
            <SelectItem
              value={model}
              key={index}
              className="hover:bg-primary/10 focus:bg-primary/15"
            >
              <div className="flex items-center">
                {getModelIcon(model)}
                <span className="font-mono font-semibold">
                  {model.toUpperCase() + ' 模型'}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
const NoAccountIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      className="h-full w-full"
    >
      <path d="M608-522 422-708q14-6 28.5-9t29.5-3q59 0 99.5 40.5T620-580q0 15-3 29.5t-9 28.5ZM234-276q51-39 114-61.5T480-360q18 0 34.5 1.5T549-354l-88-88q-47-6-80.5-39.5T341-562L227-676q-32 41-49.5 90.5T160-480q0 59 19.5 111t54.5 93Zm498-8q32-41 50-90.5T800-480q0-133-93.5-226.5T480-800q-56 0-105.5 18T284-732l448 448ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
};
