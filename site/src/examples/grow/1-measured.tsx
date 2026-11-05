import { useState } from "react";
import { Grow } from "vic-ui";
import { Button } from "vic-ui";
export const title = "Measure changing content";
export const note = "The container follows its content's height and honors reduced motion.";
export default function GrowExample() {
  const [more, setMore] = useState(false);
  return <div>
    <Button look="line" onClick={() => setMore(!more)}>Toggle details</Button>
    <Grow contentKey={more ? "details" : "summary"}>
      <p>The next step stays in the same column.</p>
      {more && <p>Additional details can be supplied by the host. ResizeObserver updates the measured height when the content changes or wraps.</p>}
    </Grow>
  </div>;
}
