// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { useState } from "react";
import { DatePicker } from "vic-ui/ui";
export default function DatePickerDemo() {
  const [date, setDate] = useState<Date>();
  return <DatePicker label="Project deadline" value={date} onValueChange={setDate} />;
}
