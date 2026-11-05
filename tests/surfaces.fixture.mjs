import { createElement as h, useRef, useState } from "react";
import { DialogSurface, DialogHeading, DialogActions, MenuSurface, PopoverSurface, TooltipSurface, ScrollArea } from "../dist/index.js";

export function SurfacesFixture() {
  const dialog = useRef(null);
  const [closed, setClosed] = useState(0);
  const [childPresses, setChildPresses] = useState(0);
  const [surfacePresses, setSurfacePresses] = useState(0);
  return h("main", null,
    h("button", { id: "open-dialog", onClick: () => dialog.current.showModal() }, "Open settings"),
    h(DialogSurface, { asChild: true, className: "consumer-frame", "aria-label": "Overridden name" },
      h("dialog", { id: "controlled-dialog", ref: dialog, "aria-label": "Settings", onClose: () => setClosed(n => n + 1) },
        h(DialogHeading, { asChild: true }, h("header", null, h("h2", null, "Settings"))),
        h("p", null, "Your existing controller owns this dialog."),
        h(DialogActions, null, h("button", { onClick: () => dialog.current.close() }, "Close settings")))) ,
    h("output", { id: "close-count" }, closed),
    h(MenuSurface, { asChild: true, className: "consumer-menu", onClick: () => setSurfacePresses(n => n + 1) },
      h("section", { id: "controlled-menu", role: "menu", "aria-label": "Actions", "data-state": "open", onClick: () => setChildPresses(n => n + 1), style: { position: "relative", width: 220 } },
        h("button", { role: "menuitem" }, "Save item"))),
    h("output", { id: "child-count" }, childPresses),
    h("output", { id: "surface-count" }, surfacePresses),
    h(PopoverSurface, { id: "popover", style: { position: "relative" } }, "Popover content"),
    h(TooltipSurface, { id: "tooltip", role: "tooltip", style: { position: "relative" } }, "Tooltip content"),
    h(ScrollArea, { id: "native-scroll", "aria-label": "Activity", style: { width: 240, height: 120 } },
      Array.from({ length: 40 }, (_, index) => h("p", { key: index }, `Activity ${index + 1}`))),
  );
}
