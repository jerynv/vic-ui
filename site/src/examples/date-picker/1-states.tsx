import { useState } from "react";
import { DatePicker } from "vic-ui";

export const title = "States";
export const note = "Its value is a YYYY-MM-DD string. min and max bound the days that can be chosen.";

export default function Example() {
  const [day, setDay] = useState<string | null>("2026-10-14");
  const [until, setUntil] = useState<string | null>(null);
  return (
    <div className="demo-stack">
      <DatePicker label="Starts" value={day} onValueChange={setDay} hint="Counted on your own clock." />
      <DatePicker label="Last day" value={until} onValueChange={setUntil} min={day ?? undefined} placeholder="Choose a day" error={until && day && until < day ? "The last day is before the first." : undefined} />
      <DatePicker aria-label="Day" size="sm" value={day} onValueChange={setDay} min="2026-10-05" max="2026-11-20" format={(d) => d} />
      <DatePicker label="Term begins" value="2026-09-01" disabled />
      <DatePicker label="Term begins" value="2026-09-01" disabledReason="Only an owner can change when a term begins." />
    </div>
  );
}
