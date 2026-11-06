import { useState } from "react";
import { Switch } from "vic-ui";

export const title = "In the accent";
export const note = "tone=\"accent\" fills the track in the brand colour when it is on. A look, not a state: the words beside it still say on or off.";

export default function Example() {
  const [sync, setSync] = useState(true);
  const [beta, setBeta] = useState(false);
  return (
    <div className="demo-stack">
      <p className="demo-row">
        <Switch tone="accent" checked={sync} onCheckedChange={setSync} aria-label="Sync across devices" />
        Sync across devices: {sync ? "on" : "off"}
      </p>
      <p className="demo-row">
        <Switch tone="accent" checked={beta} onCheckedChange={setBeta} aria-label="Try new features first" />
        Try new features first: {beta ? "on" : "off"}
      </p>
      <p className="demo-row">
        <Switch tone="accent" checked disabled disabledReason="Your workspace turns this on for everyone." aria-label="Set by your workspace" />
        On, set by your workspace
      </p>
    </div>
  );
}
