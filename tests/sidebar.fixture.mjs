import { createElement as h, Fragment, useState } from "react";
import { Button, Count, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarProvider, SidebarHeader, SidebarTrigger, useSidebar } from "../dist/index.js";

function Contents({ empty }) {
  const { toggleSidebar } = useSidebar();
  return h(Fragment, {},
    h(Sidebar, { "aria-label": "Project navigation" },
      h(SidebarHeader, {}, "Project", h(SidebarTrigger, {})),
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
// groups, counts, and the ready-made trigger in the header. `dense` sets the provider's size.
export function SidebarOptionsFixture({ dense = false }) {
  return h(SidebarProvider, { contained: true, mobileBreakpoint: 0, size: dense ? "sm" : undefined, style: { height: 400 } },
    h(Sidebar, { "aria-label": "Project navigation" },
      h(SidebarHeader, {}, h("strong", { "data-testid": "brand" }, "Project"), h(SidebarTrigger, {})),
      h(SidebarContent, {},
        h(SidebarGroup, { "data-testid": "first" },
          h(SidebarMenu, {},
            h(SidebarMenuButton, { size: "sm" }, "Small"),
            h(SidebarMenuButton, {}, "Middle", h(SidebarMenuBadge, {}, h(Count, { value: 4, label: "4 mentions", soft: true }))),
            h(SidebarMenuButton, { size: "lg" }, "Large"),
            h(SidebarMenuButton, { icon: h("svg", { width: 16, height: 16 }), count: { value: 3, label: "3 unread" } }, "Counted"),
            h(SidebarMenuButton, { size: "md" }, "Kept"),
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
    h("main", {}, h(Button, { "data-testid": "ink" }, "Save")),
  );
}
