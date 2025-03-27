'use client';
import { NewChatButton, ToggleButton } from '@/components/buttons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useConversation } from '@/hooks/use-conversation';
import { getConversations } from '@/services/conversation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
interface ConversationData {
  title: string;
  id: number;
  updated_at: string;
}
export function AppSidebar() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const { setCurrentConversationId, currentConversationId, chatTitle } =
    useConversation();
  useEffect(() => {
    if (!user) return;
    const getConversationsData = async () => {
      const response = await getConversations();
      setConversations(
        (response.data as ConversationData[]).sort((a, b) => {
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        })
      );
    };
    getConversationsData();
  }, [user, currentConversationId, chatTitle]);
  const handleClick = (id: number) => {
    return () => {
      setCurrentConversationId(id);
      if (!window.location.pathname.includes('/chat')) {
        window.location.href = '/chat';
      }
    };
  };
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex w-full justify-between">
          <ToggleButton />
          <NewChatButton />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ul>
            {conversations.map(conversation => (
              <li key={conversation.id}>
                <Button
                  onClick={handleClick(conversation.id)}
                  variant={'ghost'}
                >
                  {conversation.title}
                </Button>
              </li>
            ))}
          </ul>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
