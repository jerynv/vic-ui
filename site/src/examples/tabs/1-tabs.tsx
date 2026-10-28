import { useState } from "react";
import { Button, Tabs } from "vic-ui";

export const title = "Counts, sizes and held tabs";
export const note = "The chosen tab is told by the indicator and its colour, never its weight. A count sits in a box two digits wide, so 9 becoming 12 moves nothing.";

export default function Example() {
  const [lens, setLens] = useState("everyone");
  const [view, setView] = useState("list");
  const [count, setCount] = useState(9);
  const lenses = [
    { value: "everyone", label: "Everyone", count: count + 300 },
    { value: "staff", label: "Staff", count },
    { value: "guests", label: "Guests", count: 3 },
    { value: "invited", label: "Invited", count: "" },
  ];
  return (
    <div className="demo-wide">
      <div className="demo-row">
        <Tabs aria-label="Lens" items={lenses} value={lens} onValueChange={setLens} />
        <Button look="line" onClick={() => setCount((n) => (n === 9 ? 12 : n === 12 ? 104 : 9))}>
          Change the count ({count})
        </Button>
      </div>
      <Tabs aria-label="Lens, dense" size="sm" items={lenses} value={lens} onValueChange={setLens} />
      <Tabs
        aria-label="With a tab that cannot be chosen"
        items={[
          { value: "list", label: "List" },
          { value: "board", label: "Board" },
          { value: "chart", label: "Chart", disabledReason: "The chart opens once a position has a holder" },
          { value: "old", label: "Archive", disabled: true },
        ]}
        value={view}
        onValueChange={setView}
      />
    </div>
  );
}
