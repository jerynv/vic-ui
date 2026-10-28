import { useState } from "react";
import { Tabs } from "vic-ui";

export const title = "Two groups in one row";
export const note = "apart starts a group of its own after a hairline.";

export default function Example() {
  const [view, setView] = useState("week");
  return (
    <Tabs
      aria-label="Calendar view"
      size="sm"
      items={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "agenda", label: "Agenda", apart: true },
        { value: "people", label: "People" },
      ]}
      value={view}
      onValueChange={setView}
    />
  );
}
