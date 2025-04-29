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
import { Conversations } from '@ant-design/x';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';

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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-start">
            <Image
              src="/logo-title.png"
              alt="logo-title"
              width={1000}
              height={70}
              priority
              className="w-2/3"
            />
          </div>

          <div className="flex w-full justify-between">
            <ToggleButton />
            <NewChatButton />
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">All conversations</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Conversations
            items={conversations.map(item => ({
              key: 'index' + item.id,
              label: item.title,
            }))}
            key={conversations.length + 'conversations'}
            onActiveChange={(value: string) => {
              const id = Number(value.split('index')[1]);
              if (id) {
                setCurrentConversationId(id);
                if (!window.location.pathname.includes('/chat')) {
                  window.location.href = '/chat';
                }
              }
            }}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
