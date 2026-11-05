import { useState } from "react";
import { Switch } from "vic-ui";

export const title = "Flat and rimmed tracks";
export const note = "Flat keeps the track and knob without an inset rim. Both looks keep their hover, on, disabled and keyboard-focus states.";

function SwitchRow({ look, mode }: { look: "flat" | "rimmed"; mode: "light" | "dark" }) {
  const [off, setOff] = useState(false);
  const [on, setOn] = useState(true);
  return <div className="demo-stack">
    <strong>{look === "flat" ? "Flat" : "Rimmed (default)"}</strong>
    <div className="demo-row">
      <label className="demo-row" style={{ flexWrap: "nowrap" }}>
        <Switch look={look} checked={off} onCheckedChange={setOff} aria-label={`${mode} ${look} notifications`} />
        Notifications: {off ? "on" : "off"}
      </label>
      <label className="demo-row" style={{ flexWrap: "nowrap" }}>
        <Switch look={look} checked={on} onCheckedChange={setOn} aria-label={`${mode} ${look} automatic updates`} />
        Automatic updates: {on ? "on" : "off"}
      </label>
    </div>
    <div className="demo-row">
      <label className="demo-row" style={{ flexWrap: "nowrap" }}>
        <Switch look={look} checked={false} disabled aria-label={`${mode} ${look} disabled off`} />
        Disabled off
      </label>
      <label className="demo-row" style={{ flexWrap: "nowrap" }}>
        <Switch look={look} checked disabled aria-label={`${mode} ${look} disabled on`} />
        Disabled on
      </label>
    </div>
  </div>;
}

export default function Example() {
  return <div style={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))", gap: "1rem" }}>
    {(["light", "dark"] as const).map(mode => <section key={mode} data-mode={mode} aria-label={`${mode} switch tracks`}
      className="demo-stack" style={{ background: "var(--bg-base)", color: "var(--fg)", padding: "1rem", borderRadius: "var(--radius-panel)" }}>
      <h4>{mode === "light" ? "Light" : "Dark"}</h4>
      <SwitchRow look="flat" mode={mode} /><SwitchRow look="rimmed" mode={mode} />
    </section>)}
  </div>;
}
