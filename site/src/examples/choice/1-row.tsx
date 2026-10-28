import { useState } from "react";
import { Choice } from "vic-ui";

export const title = "A row of choices";
export const note = "The chosen one is told by its fill and colour; its words keep their weight, so the row never moves.";

export default function Example() {
  const [day, setDay] = useState("Tue");
  return (
    <div className="demo-row">
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((one) => (
        <Choice key={one} chosen={day === one} onClick={() => setDay(one)}>
          {one} 27
        </Choice>
      ))}
      <Choice chosen={false} disabled>
        Sat 1
      </Choice>
      <Choice chosen={false} disabled disabledReason="Nobody works on Sunday here.">
        Sun 2
      </Choice>
    </div>
  );
}
