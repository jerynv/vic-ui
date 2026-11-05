// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { Label, Switch } from "vic-ui/ui"

export function SwitchDemo() {
  return (
    <div style={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))", gap: "1rem" }}>
      {(["light", "dark"] as const).map(mode => <section key={mode} data-mode={mode} aria-label={`${mode} switch tracks`}
        className="grid gap-6" style={{ background: "var(--bg-base)", color: "var(--fg)", padding: "1rem", borderRadius: "var(--radius-panel)" }}>
        <h4 className="font-medium">{mode === "light" ? "Light" : "Dark"}</h4>
        {(["flat", "rimmed"] as const).map(look => <div key={look} className="grid gap-3">
          <p className="text-sm font-medium">{look === "flat" ? "Flat" : "Rimmed (default)"}</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch look={look} id={`${mode}-${look}-notifications`} />
              <Label htmlFor={`${mode}-${look}-notifications`}>Notifications</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch look={look} id={`${mode}-${look}-updates`} defaultChecked />
              <Label htmlFor={`${mode}-${look}-updates`}>Automatic updates</Label>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch look={look} id={`${mode}-${look}-disabled-off`} disabled />
              <Label htmlFor={`${mode}-${look}-disabled-off`}>Disabled off</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch look={look} id={`${mode}-${look}-disabled-on`} defaultChecked disabled />
              <Label htmlFor={`${mode}-${look}-disabled-on`}>Disabled on</Label>
            </div>
          </div>
        </div>)}
      </section>)}
    </div>
  )
}

export default SwitchDemo
