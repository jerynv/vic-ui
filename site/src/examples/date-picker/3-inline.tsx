import { useState } from "react";
import { DatePicker } from "vic-ui";
export const title = "A supplied day and a clear choice";
export const note = "This demo fixes today to 5 November 2026. The host owns timezone policy; choosing No due date returns an empty string.";
export default function InlineDates() {
  const [due, setDue] = useState("2026-11-12");
  return <div className="demo-row">
    <DatePicker aria-label="Due date" lead="Due" size="xs" value={due} onValueChange={setDue}
      today="2026-11-05" none="No due date" />
    <DatePicker aria-label="Inline due date" look="text" value={due} onValueChange={setDue}
      today="2026-11-05" none="No due date" placeholder="No due date" />
  </div>;
}
