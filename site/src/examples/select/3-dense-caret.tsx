import { useState } from "react";
import { Select } from "vic-ui";

export const title = "A dense select with a long choice";
export const note = "The dense size keeps the room its caret stands in, so a long choice ends before the caret rather than under it.";

export default function Example() {
  const [when, setWhen] = useState("fortnight");
  return (
    <div className="demo-stack" style={{ width: "14rem" }}>
      <Select size="sm" label="Remind them" value={when} onValueChange={setWhen} items={{ day: "The day before", fortnight: "Every other week until they answer" }} />
    </div>
  );
}
