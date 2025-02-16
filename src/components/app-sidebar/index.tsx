import { NewChatButton, ToggleButton } from '@/components/buttons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex w-full justify-between">
          <ToggleButton />
          <NewChatButton />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>233</SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
