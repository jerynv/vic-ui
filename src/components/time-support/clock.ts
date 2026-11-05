// Adapted from V-Client 555625f4, calendarGrid time-only helpers. No calendar or business policy.


/** The steps the time picker offers between, in minutes. */
export const TIME_STEP = 15;

/** A minute of the day as the clock says it: "09:30", and "24:00" for the end of the day. */
export function clockOf(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

/**
 * What somebody typed into a time field, as minutes into the day, or every reading it can
 * have: "930", "9:30", "9.30" and "0930" are half past nine, "9:30p", "9.30 pm" and "2130"
 * half past nine at night, "9" nine o'clock, "12a" midnight and "12p" noon. Typed without
 * am or pm, an hour from 1 to 11 is read both ways, morning first. Nothing that is not a
 * time is read as one.
 */
export function readClock(typed: string): number[] {
  const words = typed.trim().toLowerCase().replace(/\s+/g, "");
  const match = /^(\d{1,4})(?:[:.h](\d{1,2}))?(a|am|p|pm)?$/.exec(words);
  if (!match) return [];
  const [, head = "", tail, half] = match;
  let said: string;
  let minute: number;
  if (tail !== undefined) {
    if (head.length > 2 || tail.length !== 2) return [];
    said = head;
    minute = Number(tail);
  } else if (head.length <= 2) {
    said = head;
    minute = 0;
  } else {
    said = head.slice(0, -2);
    minute = Number(head.slice(-2));
  }
  const hour = Number(said);
  if (minute > 59) return [];
  if (half) {
    if (hour < 1 || hour > 12) return [];
    const base = hour % 12;
    return [(half.startsWith("p") ? base + 12 : base) * 60 + minute];
  }
  if (hour > 24 || (hour === 24 && minute > 0)) return [];
  const read = [hour * 60 + minute];
  // "0930" is said on a 24-hour clock already, so only an hour without its nought is read both ways.
  if (hour >= 1 && hour <= 11 && !said.startsWith("0")) read.push((hour + 12) * 60 + minute);
  return read;
}

/**
 * The times a time field offers for what has been typed, from `first` to `last` inclusive,
 * in steps of `TIME_STEP`: everything, when nothing is typed; otherwise every reading of
 * what was typed (`readClock`), even off the steps, then the steps whose clock begins with
 * the digits typed. Never more than `most`.
 */
export function timesFor(typed: string, first: number, last: number, most = 24): number[] {
  if (!Number.isInteger(first) || !Number.isInteger(last) || first < 0 || last > 1439 || first > last) return [];
  const inside = (minute: number) => minute >= first && minute <= last;
  const steps: number[] = [];
  for (let minute = Math.ceil(first / TIME_STEP) * TIME_STEP; minute <= last; minute += TIME_STEP) steps.push(minute);
  if (typed.trim() === "") return steps;
  const read = readClock(typed).filter(inside);
  const digits = typed.replace(/\D/g, "");
  const evening = /p/i.test(typed);
  const morning = /a/i.test(typed);
  const begun =
    digits === ""
      ? []
      : steps.filter((minute) => {
          if ((evening && minute < 12 * 60) || (morning && minute >= 12 * 60)) return false;
          const said = clockOf(minute).replace(":", "");
          // An odd number of digits began with a one-digit hour: "9" and "930" are "09" and "0930".
          return said.startsWith(digits) || (digits.length % 2 === 1 && said.startsWith(`0${digits}`));
        });
  return [...new Set([...read, ...begun])].slice(0, most);
}

/** Only integer wall-clock minutes, with no implied date, zone or next-day wrap. */
export const isMinute = (value: number): boolean => Number.isInteger(value) && value >= 0 && value < 1440;

/** Invalid host constraints fail closed instead of producing an unbounded suggestion loop. */
export function timeBounds(min = 0, max = 1439, after?: number): [number, number] {
  if (!isMinute(min) || !isMinute(max) || (after !== undefined && !isMinute(after))) return [1, 0];
  return [Math.max(min, after === undefined ? 0 : after + 1), max];
}

/** Generic duration wording from the source helper; hosts can replace it with durationLabel. */
export function durationWords(minutes: number): string {
  const hours = Math.floor(minutes / 60), rest = minutes % 60;
  return hours === 0 ? `${rest} min` : rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
