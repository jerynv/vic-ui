import { createElement as h, Fragment, useState } from "react";
import { Button, Sidebar, SidebarProvider, SidebarHeader, useSidebar } from "../dist/index.js";

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
