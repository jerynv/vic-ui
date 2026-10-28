import { useState } from "react";
import { ChoiceCards } from "vic-ui";

export const title = "One of a few, as cards";
export const note = "A real radio group, worked by the arrow keys. A card that cannot be chosen says why on itself; what it costs stands at its end. The chosen card is edged in ink, and nothing changes weight or size.";

export default function Example() {
  const [size, setSize] = useState("100");
  return (
    <div style={{ maxWidth: "28rem" }}>
      <ChoiceCards
        legend="Storage"
        name="size"
        value={size}
        onChange={setSize}
        items={[
          { value: "10", label: "10 GB", hint: "What every organisation has", end: "Included" },
          { value: "100", label: "100 GB", hint: "Charged on an owner's card", end: "$8 a month" },
          { value: "1000", label: "1 TB", off: "More than you store would need", end: "$40 a month" },
        ]}
      />
    </div>
  );
}
