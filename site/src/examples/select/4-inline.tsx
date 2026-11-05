import { useState } from "react";
import { Select } from "vic-ui";
export const title = "Thin fields and inline choices";
export const note = "lead names the choice inside the control, reserve keeps the longest option's width, and text removes the field box.";
export default function InlineSelects() {
  const [urgency, setUrgency] = useState("normal");
  const [visibility, setVisibility] = useState("private");
  return <div className="demo-row">
    <Select aria-label="Urgency" lead="Urgency" size="xs" reserve value={urgency} onValueChange={setUrgency}
      items={{ normal: "Normal", soon: "Soon", urgent: "Urgent" }} />
    <Select aria-label="Visibility" look="text" value={visibility} onValueChange={setVisibility}
      items={{ private: "Private", shared: "Shared with the workspace" }} />
  </div>;
}
