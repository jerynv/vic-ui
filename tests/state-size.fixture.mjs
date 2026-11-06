import { createElement as h, useState } from "react";
import {
  Button,
  Checkbox,
  Choice,
  Combobox,
  IconButton,
  Menu,
  Pagination,
  RadioGroup,
  Reaction,
  SearchField,
  Select,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  Switch,
  Tabs,
  TextField,
} from "../dist/index.js";

// Every interactive root piece the size test walks through. Each case is one piece in a
// flex box of its own, so the piece keeps its own width rather than the page's. `data-case`
// names it; a twin named `<case>:disabled` (or `:held`, disabled with a reason) is the same
// piece, with the same words, that cannot be used, and its box is compared with the case's.
// `data-parts` names the elements inside a piece whose own boxes are measured as well (a
// tab, a page button), and `data-chosen` how the test reaches the piece's chosen, checked or
// open state: `click` presses it and presses it again to undo, `open` presses it and Escape
// closes it, `second` presses the part at `data-pick` (1 when not given) and then the part at
// `data-back` (0) to undo.

const mark = h("svg", { width: 16, height: 16, viewBox: "0 0 16 16", "aria-hidden": true }, h("circle", { cx: 8, cy: 8, r: 5, fill: "currentColor" }));
const LOOKS = ["ink", "line", "glass", "quiet", "link"];
const SIZES = ["xs", "md", "lg"];
const ITEMS = { draft: "Draft", review: "In review", done: "Done" };

function Case({ id, parts, chosen, pick, back, children }) {
  return h("div", { className: "case", "data-case": id, "data-parts": parts, "data-chosen": chosen, "data-pick": pick, "data-back": back }, children);
}

function Toggle({ id, render }) {
  const [on, setOn] = useState(false);
  return h(Case, { id, chosen: "click" }, render(on, setOn));
}

function Buttons() {
  const cases = [];
  for (const look of LOOKS) {
    for (const size of SIZES) {
      const id = `button-${look}-${size}`;
      cases.push(
        h(Case, { key: id, id }, h(Button, { look, size, allowSecond: true }, "Save the draft")),
        h(Case, { key: `${id}:disabled`, id: `${id}:disabled` }, h(Button, { look, size, disabled: true, allowSecond: true }, "Save the draft")),
        h(Case, { key: `${id}:held`, id: `${id}:held` }, h(Button, { look, size, disabled: true, disabledReason: "Write something first", allowSecond: true }, "Save the draft")),
      );
    }
  }
  cases.push(
    h(Case, { key: "button-accent", id: "button-accent" }, h(Button, { tone: "accent", allowSecond: true }, "Send")),
    h(Case, { key: "button-accent:disabled", id: "button-accent:disabled" }, h(Button, { tone: "accent", disabled: true, allowSecond: true }, "Send")),
    h(Case, { key: "button-icon", id: "button-icon" }, h(Button, { look: "line", icon: mark, allowSecond: true }, "Attach")),
    h(Case, { key: "button-icon:disabled", id: "button-icon:disabled" }, h(Button, { look: "line", icon: mark, disabled: true, allowSecond: true }, "Attach")),
  );
  return cases;
}

function IconButtons() {
  return ["quiet", "line", "ink"].flatMap((look) => [
    h(Case, { key: look, id: `icon-button-${look}` }, h(IconButton, { look, label: "Attach", icon: mark, allowSecond: true })),
    h(Case, { key: `${look}:disabled`, id: `icon-button-${look}:disabled` }, h(IconButton, { look, label: "Attach", icon: mark, disabled: true, allowSecond: true })),
  ]);
}

function Pickers() {
  const [one, setOne] = useState("draft");
  const [found, setFound] = useState(null);
  const [tab, setTab] = useState("draft");
  const [radio, setRadio] = useState("draft");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");
  return [
    h(Case, { key: "tabs", id: "tabs", parts: "[role=tab]", chosen: "second" }, h(Tabs, { "aria-label": "Status", items: ITEMS, value: tab, onValueChange: setTab })),
    h(Case, { key: "tabs-sm", id: "tabs-sm", parts: "[role=tab]", chosen: "second" }, h(Tabs, { "aria-label": "Status", size: "sm", items: [{ value: "a", label: "Open", count: 3 }, { value: "b", label: "Closed", count: 12 }], value: tab === "draft" ? "a" : "b", onValueChange: (v) => setTab(v === "a" ? "draft" : "review") })),
    h(Case, { key: "radio", id: "radio", parts: "label", chosen: "second" }, h(RadioGroup, { legend: "Status", items: ITEMS, value: radio, onValueChange: setRadio })),
    h(Case, { key: "pagination", id: "pagination", parts: "button", chosen: "second", pick: 2, back: 1 }, h(Pagination, { page, onPageChange: setPage, pageSize: 10, total: 50, words: false })),
    h(Case, { key: "select", id: "select", chosen: "open" }, h(Select, { "aria-label": "Status", items: ITEMS, value: one, onValueChange: setOne })),
    h(Case, { key: "select:disabled", id: "select:disabled" }, h(Select, { "aria-label": "Status", items: ITEMS, value: one, disabled: true })),
    h(Case, { key: "select-sm", id: "select-sm", chosen: "open" }, h(Select, { "aria-label": "Status", size: "sm", items: ITEMS, value: one, onValueChange: setOne })),
    h(Case, { key: "combobox", id: "combobox", chosen: "open" }, h(Combobox, { "aria-label": "Status", items: ITEMS, value: found, onValueChange: setFound })),
    h(Case, { key: "combobox:disabled", id: "combobox:disabled" }, h(Combobox, { "aria-label": "Status", items: ITEMS, value: found, disabled: true })),
    h(Case, { key: "text-field", id: "text-field" }, h(TextField, { label: "Name", value: typed, onChange: (event) => setTyped(event.target.value) })),
    h(Case, { key: "text-field:disabled", id: "text-field:disabled" }, h(TextField, { label: "Name", value: typed, disabled: true, readOnly: true })),
    h(Case, { key: "text-field:held", id: "text-field:held" }, h(TextField, { label: "Name", value: typed, disabled: true, disabledReason: "Ask an owner", readOnly: true })),
    h(Case, { key: "search-field", id: "search-field" }, h(SearchField, { "aria-label": "Search", value: query, onValueChange: setQuery })),
    h(Case, { key: "search-field:disabled", id: "search-field:disabled" }, h(SearchField, { "aria-label": "Search", value: query, onValueChange: setQuery, disabled: true })),
    h(Case, { key: "search-field-full", id: "search-field-full" }, h(SearchField, { "aria-label": "Search", value: "draft", onValueChange: () => {} })),
  ];
}

function Rail() {
  const [active, setActive] = useState(false);
  return h(Case, { id: "sidebar-menu-button", chosen: "click" },
    h(SidebarProvider, { contained: true, mobileBreakpoint: 0, style: { "--sidebar-width": "240px" } },
      h(SidebarMenu, {}, h(SidebarMenuItem, {}, h(SidebarMenuButton, { icon: mark, active, onClick: () => setActive((on) => !on), count: { value: 3, label: "3 unread" } }, "Inbox"))),
    ),
  );
}

function Rows() {
  const items = [
    { label: "Rename", onSelect: () => {} },
    { label: "Move to a folder", icon: mark, onSelect: () => {} },
    { label: "Share", end: "Done", onSelect: () => {} },
    { label: "Archive", disabled: true, onSelect: () => {} },
    { label: "Delete", danger: true, onSelect: () => {} },
  ];
  return h(Case, { id: "menu", chosen: "open" },
    h(Menu, { "aria-label": "Draft", items, trigger: (props) => h(Button, { ...props, look: "line", allowSecond: true }, "More") }),
  );
}

export function Fixture() {
  return h("main", { className: "cases" },
    h(Buttons),
    h(IconButtons),
    h(Toggle, { id: "checkbox", render: (on, set) => h(Checkbox, { label: "Email me", checked: on, onCheckedChange: set }) }),
    h(Case, { id: "checkbox:disabled" }, h(Checkbox, { label: "Email me", checked: false, disabled: true, readOnly: true })),
    h(Toggle, { id: "switch", render: (on, set) => h(Switch, { "aria-label": "Email me", checked: on, onCheckedChange: set }) }),
    h(Case, { id: "switch:disabled" }, h(Switch, { "aria-label": "Email me", checked: false, disabled: true })),
    h(Toggle, { id: "switch-flat", render: (on, set) => h(Switch, { "aria-label": "Email me", look: "flat", checked: on, onCheckedChange: set }) }),
    h(Toggle, { id: "choice", render: (on, set) => h(Choice, { chosen: on, onClick: () => set(!on) }, "Weekly") }),
    h(Case, { id: "choice:disabled" }, h(Choice, { chosen: false, disabled: true }, "Weekly")),
    h(Toggle, { id: "reaction", render: (on, set) => h(Reaction, { icon: mark, label: "Agree", count: 3, pressed: on, onPress: () => set(!on) }) }),
    h(Pickers),
    h(Rail),
    h(Rows),
  );
}
