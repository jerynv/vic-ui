import type { CSSProperties } from "react";
import { Count, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "vic-ui";
import { ChatsCircleIcon, FileTextIcon, HouseIcon, UsersThreeIcon } from "vic-ui/icons";

export const title = "Row sizes, dense headings, a gap between groups and its own trigger";
export const note = "size on a row is sm, md or lg; size=\"sm\" on a heading sets it closer to its rows. --sidebar-group-gap spaces the groups while the rail is open. SidebarTrigger folds it from the page.";

export default function Example() {
  return (
    <div className="demo-wide">
      <div className="demo-frame">
        <SidebarProvider contained mobileBreakpoint={0} style={{ height: "100%", "--sidebar-group-gap": "0.75rem" } as CSSProperties}>
          <Sidebar aria-label="Sizes in the example">
            <SidebarHeader>
              <strong>Aperture Partners</strong>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuButton size="lg" icon={<HouseIcon size={16} />} tooltip="Home" active>
                    Home
                  </SidebarMenuButton>
                  <SidebarMenuButton icon={<ChatsCircleIcon size={16} />} tooltip="Chat">
                    Chat
                    <SidebarMenuBadge>
                      <Count soft value={4} label="4 mentions" />
                    </SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel size="sm">Work</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuButton size="sm" icon={<FileTextIcon size={16} />} tooltip="Documents">
                    Documents
                  </SidebarMenuButton>
                  <SidebarMenuButton size="sm" icon={<UsersThreeIcon size={16} />} tooltip="People">
                    People
                  </SidebarMenuButton>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div style={{ flex: 1, padding: "1rem" }}>
            <SidebarTrigger />
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
