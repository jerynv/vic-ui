// Adapted from shadcn/ui's date-picker composition (MIT), using its Base UI components.
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DatePickerProps {
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  label?: string;
  name?: string;
  disabled?: boolean;
}
export function DatePicker(props: DatePickerProps) {
  const [own, setOwn] = useState(props.defaultValue);
  const [open, setOpen] = useState(false);
  const date = "value" in props ? props.value : own;
  const label = props.label ?? "Choose date";
  const choose = (next: Date | undefined) => { setOwn(next); props.onValueChange?.(next); setOpen(false); };
  return <Popover open={open} onOpenChange={setOpen}>
    {props.name && <input type="hidden" name={props.name} value={date ? format(date, "yyyy-MM-dd") : ""} disabled={props.disabled} />}
    <PopoverTrigger render={<Button variant="outline" disabled={props.disabled} aria-label={date ? `${label}: ${format(date, "PPP")}` : label} />}><CalendarIcon />{date ? format(date, "PPP") : label}</PopoverTrigger>
    <PopoverContent align="start" className="w-auto p-0">
      <Calendar mode="single" selected={date} onSelect={choose} autoFocus {...(date ? { defaultMonth: date } : {})} />
      <Button variant="ghost" size="sm" className="m-2" onClick={() => choose(undefined)}>Clear date</Button>
    </PopoverContent>
  </Popover>;
}
