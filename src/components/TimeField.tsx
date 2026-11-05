import { useState, type ReactNode } from "react";
import { Combobox } from "./Combobox";
import { clockOf, durationWords, isMinute, timeBounds, timesFor } from "./time-support/clock";

export interface TimeFieldProps {
  /** Integer wall-clock minute, 0 through 1439. Invalid values display no choice. */
  value: number;
  onValueChange: (minute: number) => void;
  /** Exclusive lower bound; also shows the duration from this minute in each option. */
  after?: number;
  /** Inclusive host bounds. Invalid, reversed or out-of-day bounds offer no choices. */
  min?: number;
  max?: number;
  durationLabel?: (minutes: number) => string;
  label?: ReactNode;
  "aria-label"?: string;
  size?: "sm";
  disabled?: boolean;
  disabledReason?: string | undefined;
  className?: string;
}

/** Typed time suggestions: 930, 9:30 and 9:30p; blank suggestions use 15-minute steps. */
export function TimeField(props: TimeFieldProps) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [first, last] = timeBounds(props.min, props.max, props.after);
  const all = timesFor(term, first, last, term.trim() === "" ? 97 : 24);
  const valid = isMinute(props.value);
  // Keep a typed off-step choice on reopening too, so Enter never rounds the host's value.
  if (term.trim() === "" && valid && props.value >= first && props.value <= last && !all.includes(props.value)) {
    all.push(props.value);
    all.sort((a, b) => a - b);
  }
  const at = props.after === undefined && term.trim() === "" ? all.findIndex(minute => minute >= props.value) : -1;
  const times = at > 0 ? [...all.slice(at), ...all.slice(0, at)] : all;
  const option = (minute: number) => ({ value: String(minute), text: clockOf(minute), label: <span className="ui-time-row">{props.after === undefined ? clockOf(minute) : `${clockOf(minute)} (${(props.durationLabel ?? durationWords)(minute - props.after)})`}</span> });
  return <Combobox
    items={open ? times.map(option) : []}
    chosenItems={valid ? [option(props.value)] : []}
    value={valid ? String(props.value) : null}
    onValueChange={key => {
      const minute = Number(key);
      if (!props.disabled && isMinute(minute) && minute >= first && minute <= last) props.onValueChange(minute);
    }}
    query={term} onQueryChange={setTerm} filter={false}
    onOpenChange={next => { setOpen(next); if (!next) setTerm(""); }}
    steady placeholder="21:30" empty="Type a time, such as 21:30."
    {...(props.label !== undefined ? { label: props.label } : {})}
    {...(props["aria-label"] !== undefined ? { "aria-label": props["aria-label"] } : {})}
    {...(props.size !== undefined ? { size: props.size } : {})}
    {...(props.disabled !== undefined ? { disabled: props.disabled } : {})}
    {...(props.disabledReason !== undefined ? { disabledReason: props.disabledReason } : {})}
    {...(props.className !== undefined ? { className: props.className } : {})}
  />;
}
