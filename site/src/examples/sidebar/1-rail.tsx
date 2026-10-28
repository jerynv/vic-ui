import { useState } from "react";
import { Button, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarProvider, Switch, useSidebar } from "vic-ui";
import { CalendarEventIcon, ChatsCircleIcon, ClipboardTextIcon, FileTextIcon, HouseIcon, SidebarIcon, UsersThreeIcon } from "vic-ui/icons";

export const title = "Open, folded to its icons, and a phone's sheet";
export const note = "Folded, each row's words are its tooltip. A count's dot stays on the icon. contained keeps it inside its box rather than the window.";

const PLACES = [
  { label: "Home", icon: HouseIcon },
  { label: "Chat", icon: ChatsCircleIcon, badge: 11 },
  { label: "Calendar", icon: CalendarEventIcon },
];
const WORK = [
  { label: "Requests", icon: ClipboardTextIcon },
  { label: "Documents", icon: FileTextIcon },
  { label: "People", icon: UsersThreeIcon },
];

function Fold() {
  const { open, toggleSidebar, isMobile } = useSidebar();
  if (isMobile) return null;
  const words = open ? "Collapse" : "Expand";
  return <SidebarMenuButton icon={<SidebarIcon size={16} />} tooltip={words} aria-label={words} aria-expanded={open} onClick={toggleSidebar} />;
}

function Opener() {
  const { isMobile, setOpenMobile } = useSidebar();
  if (!isMobile) return null;
  return (
    <Button look="line" onClick={() => setOpenMobile(true)}>
      Places
    </Button>
  );
}

export default function Example() {
  const [open, setOpen] = useState(true);
  const [sheet, setSheet] = useState(false);
  const [here, setHere] = useState("Home");
  const row = (one: { label: string; icon: typeof HouseIcon; badge?: number }) => (
    <SidebarMenuButton
      key={one.label}
      icon={<one.icon size={16} weight={here === one.label ? "fill" : "regular"} />}
      active={here === one.label}
      tooltip={one.label}
      dot={one.badge ? `${one.badge} unread` : undefined}
      onClick={() => setHere(one.label)}
    >
      {one.label}
      {one.badge ? <SidebarMenuBadge>{one.badge}</SidebarMenuBadge> : null}
    </SidebarMenuButton>
  );
  return (
    <div className="demo-wide">
      <div className="demo-row">
        <label className="demo-row">
          <Switch checked={open} onCheckedChange={setOpen} aria-label="Open" />
          Open
        </label>
        <label className="demo-row">
          <Switch checked={sheet} onCheckedChange={setSheet} aria-label="As a phone's sheet" />
          As a phone's sheet
        </label>
      </div>
      <div className="demo-frame">
        <SidebarProvider contained open={open} onOpenChange={setOpen} mobileBreakpoint={sheet ? 100000 : 0} style={{ height: "100%" }}>
          <Sidebar aria-label="Places in the example">
            <SidebarHeader>
              <strong>Aperture Partners</strong>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>{PLACES.map(row)}</SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Work</SidebarGroupLabel>
                <SidebarMenu>{WORK.map(row)}</SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <Fold />
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div style={{ flex: 1, padding: "1rem" }}>
            <Opener />
            <p>{here}</p>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
