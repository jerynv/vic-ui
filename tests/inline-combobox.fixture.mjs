import { createElement as h, useState } from "react";
import { Button, Combobox, ComboboxRoot, ComboboxSearch, ComboboxList, ComboboxItem, ComboboxGroup, ComboboxEmpty } from "../dist/index.js";

const alpha = [
  { value: "swift:/模型 #1", label: "Swift" },
  { value: 'balanced"[]', label: "Balanced", disabled: true },
  { value: "a b", label: "Reasoned" },
  { value: "a-b", label: "Vision" },
  { value: "small", label: "Small" },
  { value: "large", label: "Large" },
];
const beta = [{ value: "sprout", label: "Sprout" }, { value: "cedar", label: "Cedar", disabled: true }, { value: "juniper", label: "Juniper" }];

function Picker({ name, mode }) {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState(alpha[0].value);
  const [open, setOpen] = useState(true);
  const [provider, setProvider] = useState("Alpha");
  const [reverse, setReverse] = useState(false);
  const [disableSwift, setDisableSwift] = useState(false);
  const [escapes, setEscapes] = useState(0);
  const [footer, setFooter] = useState(0);
  const rows = (provider === "Alpha" ? alpha : beta).map(item => item.value === alpha[0].value && disableSwift ? { ...item, disabled: true } : item);
  if (reverse) rows.reverse();
  const shown = rows.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  return h("section", { role: "region", "aria-label": name, "data-mode": mode, className: "fixture-picker", onKeyDown: e => { if (e.key === "Escape") setEscapes(n => n + 1); } },
    h("h2", null, name),
    h(ComboboxRoot, { label: "Models", items: shown, query, onQueryChange: setQuery, value, onValueChange: setValue, open, onOpenChange: setOpen },
      h("div", { className: "fixture-layout" },
        h("nav", { "aria-label": "Providers", className: "fixture-rail" },
          h(Button, { look: "quiet", square: true, "aria-label": "Alpha provider", onClick: () => setProvider("Alpha") }, "A"),
          h(Button, { look: "quiet", square: true, "aria-label": "Beta provider", onClick: () => setProvider("Beta") }, "B")),
        h("div", { className: "fixture-column" },
          h(ComboboxSearch, { placeholder: "Search models" }),
          h(ComboboxEmpty, null, "No models found"),
          h(ComboboxList, { className: "fixture-list" },
            h(ComboboxGroup, { label: provider }, shown.map(item => h(ComboboxItem, { key: item.value, value: item.value }, item.label)))),
          h("footer", { className: "fixture-footer" }, h(Button, { look: "quiet", onClick: () => setFooter(n => n + 1) }, "Manage providers"))))),
    h("div", { className: "fixture-actions" },
      h(Button, { look: "line", onClick: () => setOpen(v => !v) }, "Toggle list"),
      h(Button, { look: "line", onClick: () => setReverse(v => !v) }, "Reverse order"),
      h(Button, { look: "line", onClick: () => setDisableSwift(v => !v) }, "Disable Swift")),
    h("output", { className: "fixture-state" }, JSON.stringify({ query, value, open, provider, escapes, footer })));
}

function LockedPicker({ disabled = false }) {
  const [events, setEvents] = useState([]);
  const record = kind => value => setEvents(list => [...list, [kind, value]]);
  return h("section", { role: "region", "aria-label": disabled ? "Disabled picker" : "Controlled refusal" },
    h(ComboboxRoot, { label: disabled ? "Disabled models" : "Fixed models", items: alpha, query: "", value: null, open: true, disabled,
      onQueryChange: record("query"), onValueChange: record("value"), onOpenChange: record("open") },
      h(ComboboxSearch, { placeholder: "Search models" }),
      h(ComboboxList, null, alpha.map(item => h(ComboboxItem, { key: item.value, value: item.value }, item.label)))),
    h("output", { className: "fixture-events" }, JSON.stringify(events)));
}

function RestrictedPicker({ kind }) {
  const [restricted, setRestricted] = useState(true);
  const [events, setEvents] = useState([]);
  return h("section", { role: "region", "aria-label": `Search ${kind}` },
    h(ComboboxRoot, { label: `Search ${kind}`, items: alpha, onValueChange: value => setEvents(list => [...list, value]) },
      h(ComboboxSearch, { [kind]: restricted }),
      h(ComboboxList, null, alpha.map(item => h(ComboboxItem, { key: item.value, value: item.value }, item.label)))),
    h(Button, { onClick: () => setRestricted(false) }, "Unlock search"),
    h("output", { className: "fixture-events" }, JSON.stringify(events)));
}

export function InlineComboboxFixture() {
  const [oldValue, setOldValue] = useState(null);
  return h("main", null,
    h("div", { className: "fixture-pair" }, h(Picker, { name: "Primary model picker" }), h(Picker, { name: "Second model picker", mode: "dark" })),
    h(LockedPicker, null), h(LockedPicker, { disabled: true }),
    h(RestrictedPicker, { kind: "disabled" }), h(RestrictedPicker, { kind: "readOnly" }),
    h(Combobox, { label: "Original combobox", items: { one: "One", two: "Two" }, value: oldValue, onValueChange: setOldValue, placeholder: "Choose number" }),
    h("output", { id: "original-value" }, oldValue ?? "none"));
}

export const fixtureCSS = `
  body { margin: 0; }
  main { padding: 24px; display: grid; gap: 24px; }
  .fixture-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .fixture-picker { min-width: 0; padding: 16px; background: var(--bg-base); color: var(--fg); }
  .fixture-picker h2 { margin: 0 0 16px; font-size: 18px; }
  .fixture-layout { display: flex; align-items: stretch; }
  .fixture-rail { width: 44px; flex: 0 0 44px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .fixture-column { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
  .fixture-list { max-height: 144px; overflow-y: auto; }
  .fixture-footer { padding-top: 8px; }
  .fixture-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .fixture-state { display: block; font-size: 11px; overflow-wrap: anywhere; margin-top: 12px; }
  @media (max-width: 600px) { main { padding: 12px; } .fixture-pair { grid-template-columns: minmax(0, 1fr); } }
`;
