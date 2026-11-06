import { createElement as h } from "react";
import { Button, Row, Rows, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarProvider, Table, Tabs, TextField } from "../dist/index.js";

// One of each piece the density moves, drawn the same in every section. The menu's items, the
// inline combobox's row and the place picker's row are drawn by their classes, since each only
// shows inside its open list.
function Pieces({ name }) {
  return h("div", { "data-testid": name, style: { display: "grid", gap: 8, width: 420 } },
    h(TextField, { "aria-label": `${name} field`, "data-testid": `${name}-field`, defaultValue: "Words" }),
    h(TextField, { "aria-label": `${name} small field`, size: "sm", defaultValue: "Words" }),
    h(Button, { "data-testid": `${name}-button` }, "Save"),
    h(Button, { size: "lg", "data-testid": `${name}-button-lg` }, "Save"),
    h(Tabs, { "aria-label": `${name} tabs`, value: "one", onValueChange: () => {}, items: { one: "One", two: "Two" } }),
    h(Rows, {}, h(Row, { mark: h("span", {}, "M"), words: "A row" })),
    h("div", { className: "ui-menu ui-menu-actions", style: { position: "static" } },
      h("div", { className: "ui-menu-item", role: "menuitem" }, h("span", { className: "ui-menu-words" }, "An action")),
    ),
    h(Table, { "aria-label": `${name} table`, columns: [{ key: "name", label: "Name" }], rows: [{ name: "Ada" }], rowKey: (row) => row.name }),
    h("div", { className: "ui-combobox-item", role: "option", "aria-selected": false }, "An option"),
    h("button", { type: "button", className: "ui-place-row" }, h("span", { className: "ui-place-row-words" }, "A place")),
    h("div", { "data-testid": `${name}-roster` }, h(Table, { look: "roster", "aria-label": `${name} roster`, columns: [{ key: "name", label: "Name" }], rows: [{ name: "Ada" }], rowKey: (row) => row.name })),
  );
}

function Rail({ size, testid }) {
  return h("div", { "data-testid": testid },
    h(SidebarProvider, { contained: true, mobileBreakpoint: 0, size, style: { height: 220 } },
      h(Sidebar, { "aria-label": `${testid} navigation` },
        h(SidebarContent, {},
          h(SidebarGroup, {},
            h(SidebarGroupLabel, {}, "Places"),
            h(SidebarMenu, {}, h(SidebarMenuButton, {}, "Home"), h(SidebarMenuButton, { size: "md" }, "Kept")),
          ),
        ),
      ),
      h("main", {}),
    ),
  );
}

export function DensityTypeFixture() {
  return h("div", { style: { display: "grid", gap: 24, padding: 16 } },
    h(Pieces, { name: "default" }),
    h("section", { "data-density": "compact" },
      h(Pieces, { name: "compact" }),
      h("div", { "data-mode": "dark" }, h(Pieces, { name: "compact-dark" })),
      h("div", { "data-density": "default" }, h(Pieces, { name: "reset" })),
      h(Rail, { testid: "compact-rail" }),
    ),
    h("section", { "data-density": "comfortable" }, h(Pieces, { name: "comfortable" })),
    h(Rail, { testid: "default-rail" }),
    h(Rail, { size: "sm", testid: "sm-rail" }),
    h("h2", { className: "ui-dialog-title", "data-testid": "title" }, "Invite people"),
    h("p", { "data-testid": "sample", style: { width: 360, margin: 0, fontWeight: 500, fontSize: 16, lineHeight: "normal" } },
      "Invite people to your workspace and choose what they can see. Settings, billing and members stay with the owner. Save changes or discard them before you leave this page."),
  );
}
