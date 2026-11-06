import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarProvider, SidebarTrigger, Switch } from "vic-ui";
import { ChatsCircleIcon, FileTextIcon, HouseIcon, UsersThreeIcon } from "vic-ui/icons";

export const title = "Dense rows, counts, and the trigger in the header";
export const note = "size=\"sm\" on the provider sets every row 1.75rem and every heading a step smaller; a row's own size outranks it. count draws a soft pill, and folded the dot. Folded, the header shows only its trigger.";

export default function Example() {
  const [dense, setDense] = useState(true);
  const [here, setHere] = useState("Home");
  const row = (label: string, Icon: typeof HouseIcon, count?: { value: number; label: string }) => (
    <SidebarMenuButton key={label} icon={<Icon size={16} weight={here === label ? "fill" : "regular"} />} tooltip={label} active={here === label} onClick={() => setHere(label)} {...(count ? { count } : {})}>
      {label}
    </SidebarMenuButton>
  );
  return (
    <div className="demo-wide">
      <label className="demo-row">
        <Switch checked={dense} onCheckedChange={setDense} aria-label="Dense" />
        Dense
      </label>
      <div className="demo-frame">
        <SidebarProvider contained mobileBreakpoint={0} size={dense ? "sm" : "md"} style={{ height: "100%" }}>
          <Sidebar aria-label="Sizes in the example">
            <SidebarHeader>
              <strong>Aperture Partners</strong>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {row("Home", HouseIcon)}
                  {row("Chat", ChatsCircleIcon, { value: 4, label: "4 mentions" })}
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Work</SidebarGroupLabel>
                <SidebarMenu>
                  {row("Documents", FileTextIcon)}
                  {row("People", UsersThreeIcon, { value: 12, label: "12 waiting to join" })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div style={{ flex: 1, padding: "1rem" }}>
            <p>{here}</p>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
