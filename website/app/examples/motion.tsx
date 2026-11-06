import { useState } from "react";
import { Card, Switch, Tabs } from "vic-ui";

// A faster system only where the reader has not asked for less motion; a still one everywhere.
const SYSTEMS = [
  { name: "Default", note: "150, 220 and 300ms.", className: "" },
  { name: "Snappier", note: "100, 150 and 200ms.", className: "motion-safe:[--motion-fast:100ms] motion-safe:[--motion-base:150ms] motion-safe:[--motion-slow:200ms]" },
  { name: "Still", note: "Every duration zero.", className: "[--motion-fast:0s] [--motion-base:0s] [--motion-slow:0s]" },
];

function System({ name, note, className }: (typeof SYSTEMS)[number]) {
  const [on, setOn] = useState(false);
  const [view, setView] = useState("list");
  return <div className={`min-w-0 ${className}`}>
    <Card title={name} description={note}>
      <div className="grid justify-items-start gap-4">
        <Tabs aria-label={`${name} view`} size="sm" items={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} value={view} onValueChange={setView} />
        <Switch aria-label={`${name} switch`} checked={on} onCheckedChange={setOn} />
      </div>
    </Card>
  </div>;
}

export default function MotionDemo() {
  return <div className="grid w-full gap-6 md:grid-cols-3">{SYSTEMS.map(system => <System key={system.name} {...system} />)}</div>;
}
