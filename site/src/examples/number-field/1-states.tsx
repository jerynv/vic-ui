import { useState } from "react";
import { NumberField } from "vic-ui";

export const title = "States";
export const note = "Its words are typed freely and checked by the page, so a half typed number is never thrown away.";

export default function Example() {
  const [price, setPrice] = useState("24");
  const [rate, setRate] = useState("1.50");
  const [seats, setSeats] = useState("abc");
  return (
    <div className="demo-stack">
      <NumberField label="Price per seat" prefix="$" suffix="a month" value={price} onValueChange={setPrice} hint="In whole dollars or cents." />
      <NumberField label="Recording rate" prefix="$" suffix="per hour" value={rate} onValueChange={setRate} />
      <NumberField label="Seats" whole value={seats} onValueChange={setSeats} error={/^\d+$/.test(seats) ? undefined : "Type a whole number of seats."} />
      <NumberField aria-label="Minutes each" size="sm" whole suffix="minutes" value="30" onValueChange={() => undefined} />
      <NumberField label="Seats" value="12" onValueChange={() => undefined} disabled />
      <NumberField label="Seats" value="12" onValueChange={() => undefined} disabledReason="Seats change with a change of terms." />
    </div>
  );
}
