import { useState } from "react";
import { Combobox, type Option } from "vic-ui";

export const title = "One choice";
export const note = "Finds as it is typed into. text is what a search matches, where it differs from the label.";

const ZONES: Option[] = [
  { value: "America/New_York", label: "New York", text: "New York Eastern" },
  { value: "America/Chicago", label: "Chicago", text: "Chicago Central" },
  { value: "America/Denver", label: "Denver", text: "Denver Mountain" },
  { value: "America/Los_Angeles", label: "Los Angeles", text: "Los Angeles Pacific" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney", disabled: true, hint: "Not offered yet" },
];

export default function Example() {
  const [zone, setZone] = useState<string | null>("Europe/London");
  const [unset, setUnset] = useState<string | null>(null);
  return (
    <div className="demo-stack">
      <Combobox label="Time zone" items={ZONES} value={zone} onValueChange={setZone} placeholder="New York" empty="No time zone by that name" hint="Dates here are counted in this zone." />
      <Combobox label="Time zone" items={ZONES} value={unset} onValueChange={setUnset} placeholder="New York" empty="No time zone by that name" error="Choose a time zone." />
      <Combobox label="Time zone" items={ZONES} value="Asia/Tokyo" placeholder="New York" disabled />
      <Combobox label="Time zone" items={ZONES} value="Asia/Tokyo" placeholder="New York" disabledReason="Only an owner can change the zone." />
    </div>
  );
}
