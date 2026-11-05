import { useState } from "react";
import { TimeField } from "vic-ui";

export const title = "Typed time suggestions";

export default function TimeSuggestions() {
  const [start, setStart] = useState(9 * 60), [end, setEnd] = useState(10 * 60);
  return <div style={{ display: "grid", gap: "1rem" }}>
    <TimeField label="Starts" value={start} onValueChange={setStart} min={8 * 60} max={18 * 60} />
    <TimeField label="Ends" value={end} onValueChange={setEnd} after={start} max={18 * 60} />
  </div>;
}
