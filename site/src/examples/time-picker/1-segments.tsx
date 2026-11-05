import { useState } from "react";
import { TimePicker } from "vic-ui";

export const title = "Exact hour and minute";

export default function ExactTime() {
  const [time, setTime] = useState("09:30");
  return <TimePicker label="Opens at" name="opening" value={time} onValueChange={setTime} min="06:00" max="22:00" none="No set time" hint="Use the arrow keys or type an hour and minute." />;
}
