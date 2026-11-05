import { useState } from "react";
import { PaneView, PaneViews } from "vic-ui";
import { Button } from "vic-ui";
import { TextField } from "vic-ui";
export const title = "Keep each view's state";
export const note = "Switching hides the inactive view without unmounting it or moving the content.";
export default function PersistentPaneExample() {
  const [active, setActive] = useState("notes");
  return <div>
    <Button look="line" onClick={() => setActive(active === "notes" ? "details" : "notes")}>Switch view</Button>
    <PaneViews active={active}>
      <PaneView value="notes"><TextField label="Notes" placeholder="Type, switch away, then return" /></PaneView>
      <PaneView value="details"><TextField label="Details" placeholder="This view keeps its own value" /></PaneView>
    </PaneViews>
  </div>;
}
