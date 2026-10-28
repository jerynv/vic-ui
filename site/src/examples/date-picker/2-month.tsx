import { useState } from "react";
import { MonthGrid } from "vic-ui";

export const title = "A month on the page";
export const note = "The grid DatePicker opens, standing on its own: the arrows move a day or a week, Page Up and Page Down a month (with Shift a year), Home and End the week's ends, Enter or Space chooses. The calendar keeps one in its side column.";

export default function Example() {
  const [value, setValue] = useState("2026-10-28");
  const [focus, setFocus] = useState(value);
  return (
    <div className="demo-row" style={{ alignItems: "flex-start" }}>
      <MonthGrid focus={focus} onFocusChange={setFocus} value={value} today="2026-10-28" onChoose={(day) => { setValue(day); setFocus(day); }} />
      <span className="demo-words">Chosen: {value}</span>
    </div>
  );
}
