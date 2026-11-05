// Adapted from V-Client 555625f4, web/src/lib/timePicker.ts.
import { parseTime, type Time } from "@internationalized/date";

/** A wall-clock "HH:MM" as React Aria's Time, or null for "" and for anything not exactly that. */
export function timePickerValue(value: string): Time | null {
  if (!/^\d{2}:\d{2}$/.test(value)) return null;
  try {
    return parseTime(value);
  } catch {
    return null;
  }
}

/** React Aria's Time as the "HH:MM" the server keeps, seconds dropped; null is "". */
export function timePickerWireValue(value: Pick<Time, "hour" | "minute"> | null): string {
  return value ? `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}` : "";
}
