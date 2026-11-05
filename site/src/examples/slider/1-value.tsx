import { useState } from "react";
import { Slider } from "vic-ui";

export const title = "A numeric value";
export const note = "Track presses take a small step. Drag the thumb or use arrow, Page, Home and End keys.";
export default function Example() {
  const [value, setValue] = useState(75);
  return <div className="demo-stack" style={{ width: "100%", maxWidth: "28rem" }}>
    <Slider label="Volume" value={value} onValueChange={setValue} valueText={`${value} percent`} />
    <output>{value}%</output>
    <Slider label="Color position" defaultValue={180} max={360} valueText={value => `${value} degrees`}
      trackStyle={{ background: "linear-gradient(to right, var(--tone-danger-ink), var(--tone-caution-ink), var(--tone-settled-ink), var(--tone-moving-ink))" }} />
    <Slider label="Unavailable" defaultValue={40} disabled />
  </div>;
}
