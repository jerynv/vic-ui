import { useState } from "react";
import { Button } from "vic-ui";
import { CheckIcon } from "vic-ui/icons";

export const title = "Busy";
export const note = "While busy the button is aria-busy and held. A spinner stands where its icon was, or over its words where it has none; the words keep their room unseen, so the button keeps its width.";

export default function Example() {
  const [busy, setBusy] = useState(true);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button busy={busy}>Save the changes</Button>
        <Button look="line" busy={busy} icon={<CheckIcon size={16} />}>
          Mark as done
        </Button>
        <Button look="line" square busy={busy} icon={<CheckIcon size={16} />} aria-label="Mark as done" />
      </div>
      <div className="demo-row">
        <Button look="quiet" onClick={() => setBusy((now) => !now)}>
          {busy ? "Stop the wait" : "Start the wait"}
        </Button>
      </div>
    </div>
  );
}
