import { createElement as h, Fragment, useState } from "react";
import { Button, Count, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarProvider, SidebarHeader, SidebarTrigger, useSidebar } from "../dist/index.js";

function Contents({ empty }) {
  const { toggleSidebar } = useSidebar();
  return h(Fragment, {},
    h(Sidebar, { "aria-label": "Project navigation" },
      h(SidebarHeader, {}, "Project"),
      !empty && h(Button, { look: "quiet" }, "First page"),
      !empty && h(Button, { look: "quiet" }, "Last page"),
    ),
    h("main", {}, h(Button, { onClick: toggleSidebar }, "Open navigation"), h("input", { "aria-label": "Background" })),
  );
}

export function SidebarFixture({ contained = false, empty = false }) {
  const [open, setOpen] = useState(false);
  return h(SidebarProvider, { contained, openMobile: open, onOpenMobileChange: setOpen, style: { minHeight: 400, "--sidebar-width": "200px" } }, h(Contents, { empty }));
}

// The rail's options at a desktop width: row sizes, a dense group label, the gap between
// groups, a soft count and the ready-made trigger.
export function SidebarOptionsFixture() {
  return h(SidebarProvider, { contained: true, mobileBreakpoint: 0, style: { height: 400, "--sidebar-group-gap": "0.75rem" } },
    h(Sidebar, { "aria-label": "Project navigation" },
      h(SidebarContent, {},
        h(SidebarGroup, { "data-testid": "first" },
          h(SidebarMenu, {},
            h(SidebarMenuButton, { size: "sm" }, "Small"),
            h(SidebarMenuButton, {}, "Middle", h(SidebarMenuBadge, {}, h(Count, { value: 4, label: "4 mentions", soft: true }))),
            h(SidebarMenuButton, { size: "lg" }, "Large"),
          ),
        ),
        h(SidebarGroup, { "data-testid": "second" },
          h(SidebarGroupLabel, { size: "sm", "data-testid": "dense" }, "Dense"),
          h(SidebarMenu, {}, h(SidebarMenuButton, {}, "Under dense")),
        ),
        h(SidebarGroup, {},
          h(SidebarGroupLabel, { "data-testid": "plain" }, "Plain"),
          h(SidebarMenu, {}, h(SidebarMenuButton, {}, "Under plain")),
        ),
      ),
    ),
    h("main", {}, h(SidebarTrigger, { "data-testid": "trigger" })),
  );
}
