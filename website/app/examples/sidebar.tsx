// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
"use client"

import {
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
} from "lucide-react"

import { SidebarTrigger } from "vic-ui/ui"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "vic-ui/ui"

const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: FrameIcon,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChartIcon,
  },
  {
    name: "Travel",
    url: "#",
    icon: MapIcon,
  },
  {
    name: "Support",
    url: "#",
    icon: LifeBuoyIcon,
  },
  {
    name: "Feedback",
    url: "#",
    icon: SendIcon,
  },
]

export default function AppSidebar() {

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton render={<a href={project.url} />}>
                      <project.icon />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between px-4">
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
