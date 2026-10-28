import { useState } from "react";
import { Switch } from "vic-ui";

export const title = "States";
export const note = "A switch says its state in words beside it, never by its colour alone.";

export default function Example() {
  const [named, setNamed] = useState(true);
  const [invited, setInvited] = useState(false);
  return (
    <div className="demo-stack">
      <p className="demo-row">
        <Switch checked={named} onCheckedChange={setNamed} aria-label="Email me when somebody names me" />
        Email me when somebody names me: {named ? "on" : "off"}
      </p>
      <p className="demo-row">
        <Switch checked={invited} onCheckedChange={setInvited} aria-label="Email me when I am invited" />
        Email me when I am invited: {invited ? "on" : "off"}
      </p>
      <p className="demo-row">
        <Switch checked disabled disabledReason="Only an owner or an admin changes this." aria-label="Not yours to change" />
        On, not yours to change
      </p>
    </div>
  );
}
