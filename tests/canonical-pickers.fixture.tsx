import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../src/components/Button";
import { Select } from "../src/components/Select";
import { DatePicker } from "../src/components/DatePicker";
import { Dialog } from "../src/components/Dialog";
import "../src/styles/tokens.css";
import "../src/styles/components/ui-canonical-controls.css";
import "./canonical-pickers.fixture.css";
document.documentElement.dataset.mode = new URLSearchParams(location.search).get("theme") ?? "light";
function Example() {
  const [choice, setChoice] = useState("brief"), [day, setDay] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false), [outer, setOuter] = useState(false), [inner, setInner] = useState(false);
  Object.assign(window, { disablePickers: () => setDisabled(true) });
  return <main>
    <h1>Canonical picker options</h1>
    <p id="external">External instructions.</p>
    <form id="pickers">
      <Select aria-label="Reserved choice" name="choice" value={choice} onValueChange={setChoice} items={[{ value: "brief", label: "Brief" }, { value: "long", label: "A substantially longer choice" }]} look="text" lead="Report" reserve size="xs" surface="bordered" />
      <Select label="Held choice" value="brief" items={["brief"]} disabled disabledReason="Choice is unavailable." hint="Choice hint" aria-describedby="external" />
      <DatePicker label="Due date" value={day} onValueChange={setDay} today="2031-02-03" min="2031-02-01" max="2031-02-28" none="No due date" lead="Due" placeholder="Choose date" size="xs" name="day" surface="bordered" />
      <DatePicker label="Held date" value={null} disabled disabledReason="Date is unavailable." hint="Date hint" aria-describedby="external" />
      <Select label="Changing choice" value={choice} items={["brief", "long"]} onValueChange={setChoice} disabled={disabled} disabledReason="Choices are updating." />
      <DatePicker label="Changing date" value={day} today="2031-02-03" onValueChange={setDay} disabled={disabled} disabledReason="Dates are updating." />
      <DatePicker aria-label="Text date" value={day} look="text" placeholder="Set a date" />
    </form>
    <Button look="line" onClick={() => setOuter(true)}>Open side sheet</Button>
    <Dialog title="Side sheet" open={outer} onOpenChange={setOuter} side="right" foot={<Button look="line" onClick={() => setOuter(false)}>Close sheet</Button>}>
      <Button look="line" onClick={() => setInner(true)}>Open nested dialog</Button>
      <Dialog title="Nested dialog" open={inner} onOpenChange={setInner} foot={<Button look="line" onClick={() => setInner(false)}>Close nested</Button>}><p>Escape closes only this dialog.</p></Dialog>
    </Dialog>
  </main>;
}
createRoot(document.getElementById("root")!).render(<Example />);
