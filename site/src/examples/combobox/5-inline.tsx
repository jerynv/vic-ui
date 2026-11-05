import { useRef, useState } from "react";
import { Button, ComboboxEmpty, ComboboxGroup, ComboboxItem, ComboboxList, ComboboxRoot, ComboboxSearch, PopoverSurface } from "vic-ui";
import { CheckIcon, RobotIcon, StarIcon } from "vic-ui/icons";

export const title = "Inline model picker";
export const note = "Illustrative providers and models. A 44px provider rail, pinned search, 32px rows and separate footer compose from Vic primitives. Filtering and selection belong to this example.";

const providers = [
  { value: "northstar", label: "Northstar", icon: StarIcon },
  { value: "local", label: "Local", icon: RobotIcon },
] as const;
const models = [
  { value: "northstar/atlas", label: "Atlas", provider: "northstar" },
  { value: "northstar/atlas-fast", label: "Atlas Fast", provider: "northstar" },
  { value: "northstar/atlas-reason", label: "Atlas Reason", provider: "northstar" },
  { value: "northstar/atlas-code", label: "Atlas Code", provider: "northstar" },
  { value: "northstar/atlas-vision", label: "Atlas Vision", provider: "northstar" },
  { value: "northstar/atlas-legacy", label: "Atlas Legacy", provider: "northstar", disabled: true },
  { value: "local/cedar", label: "Cedar", provider: "local" },
  { value: "local/cedar-small", label: "Cedar Small", provider: "local" },
  { value: "local/cedar-code", label: "Cedar Code", provider: "local" },
];

function Picker({ mode }: { mode: "light" | "dark" }) {
  const [provider, setProvider] = useState<string>("northstar");
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<string | null>("northstar/atlas");
  const [open, setOpen] = useState(true);
  const search = useRef<HTMLInputElement>(null);
  const visible = models.filter(model => model.provider === provider && model.label.toLowerCase().includes(query.trim().toLowerCase()));
  const chosen = models.find(model => model.value === value)?.label ?? "None";
  const providerName = providers.find(item => item.value === provider)!.label;
  return <section data-mode={mode} aria-label={`${mode} inline picker`} style={{ minWidth: 0, padding: "1rem", color: "var(--fg)", background: "var(--bg-base)", borderRadius: "var(--radius-panel)" }}>
    <h4 style={{ marginBottom: ".75rem" }}>{mode === "light" ? "Light" : "Dark"}</h4>
    <ComboboxRoot label={`${mode} models`} items={visible} query={query} onQueryChange={setQuery} value={value} onValueChange={setValue} open={open} onOpenChange={setOpen} closeOnSelect={false}>
      <PopoverSurface style={{ width: "100%", maxWidth: "none", padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "44px minmax(0, 1fr)" }}>
          <div role="group" aria-label={`${mode} providers`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".25rem", paddingBlock: ".5rem", borderRight: "1px solid var(--line)" }}>
            {providers.map(item => <Button key={item.value} look="quiet" square aria-label={item.label} title={item.label} aria-pressed={provider === item.value} icon={<item.icon size={16} />} onClick={() => { setProvider(item.value); setQuery(""); setOpen(true); search.current?.focus(); }} />)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ padding: ".5rem" }}><ComboboxSearch ref={search} placeholder="Search models" /></div>
            <div style={{ height: 184, minHeight: 0 }}>
              <ComboboxList style={{ maxHeight: "100%" }}>
                <ComboboxGroup label={providerName}>
                  {visible.map(model => <ComboboxItem key={model.value} value={model.value}>
                    <span style={{ flex: 1 }}>{model.label}</span>
                    {model.disabled ? <span style={{ color: "var(--fg-subtle)", fontSize: "var(--text-meta)" }}>Unavailable</span> : null}
                    {value === model.value ? <CheckIcon size={16} aria-hidden="true" /> : null}
                  </ComboboxItem>)}
                </ComboboxGroup>
              </ComboboxList>
              <ComboboxEmpty>No models match your search.</ComboboxEmpty>
              {!open ? <p style={{ padding: ".75rem", color: "var(--fg-subtle)" }}>Focus search to reopen the list.</p> : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".5rem", padding: ".5rem .75rem", borderTop: "1px solid var(--line)" }}>
              <span style={{ minWidth: 0, fontSize: "var(--text-meta)" }}>Selected: {chosen}</span>
              <Button look="quiet" onClick={() => { setQuery(""); setOpen(true); search.current?.focus(); }}>Reset search</Button>
            </div>
          </div>
        </div>
      </PopoverSurface>
    </ComboboxRoot>
  </section>;
}

export default function Example() {
  return <div className="demo-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 19rem), 1fr))", gap: "1rem" }}>
    <Picker mode="light" /><Picker mode="dark" />
  </div>;
}
