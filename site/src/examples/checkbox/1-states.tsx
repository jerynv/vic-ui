import { useState } from "react";
import { Checkbox } from "vic-ui";

export const title = "States";

export default function Example() {
  const [ticked, setTicked] = useState(true);
  return (
    <div className="demo-stack">
      <Checkbox checked={ticked} onCheckedChange={setTicked} label="I accept the agreement and the Privacy Policy." />
      <Checkbox label="Not yet ticked" />
      <Checkbox disabled label="Not offered here" />
      <Checkbox disabled disabledReason="Read the agreement to the end first." label="I accept the agreement" />
      <label className="demo-row">
        <Checkbox aria-label="Show yours" defaultChecked />
        <span>The box alone, inside a row's own label</span>
      </label>
    </div>
  );
}
