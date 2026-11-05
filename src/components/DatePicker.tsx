import type { SurfaceStyle } from "./Surface";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CalendarEventIcon, ChevronDownIcon, ChevronRightIcon } from "../icons/icons";
import { CheckMark } from "./Checkbox";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useAnchored, usePressAway } from "./Popover";
import { useBlocked } from "./reason";
import { reasonOf, unlessHeld } from "./held";

/** A calendar date as `YYYY-MM-DD`, never an instant. */
type Day = string;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT_MONTHS = MONTHS.map((month) => month.slice(0, 3));
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const pad = (n: number) => String(n).padStart(2, "0");
const parts = (day: Day): [number, number, number] => {
  const [y, m, d] = day.split("-").map(Number);
  return [y!, m!, d!];
};
const dayOf = (y: number, m: number, d: number): Day => {
  const at = new Date(Date.UTC(y, m - 1, d));
  return `${at.getUTCFullYear()}-${pad(at.getUTCMonth() + 1)}-${pad(at.getUTCDate())}`;
};
const isDay = (value: string | null | undefined): value is Day => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
const addDays = (day: Day, by: number): Day => {
  const [y, m, d] = parts(day);
  return dayOf(y, m, d + by);
};
/** Monday is 0. */
const weekday = (day: Day): number => {
  const [y, m, d] = parts(day);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
};
const addMonths = (day: Day, by: number): Day => {
  const [y, m, d] = parts(day);
  const last = new Date(Date.UTC(y, m - 1 + by + 1, 0)).getUTCDate();
  return dayOf(y, m + by, Math.min(d, last));
};
const monthStart = (day: Day): Day => `${day.slice(0, 7)}-01`;
const today = (): Day => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
/** "Mon 3 Oct 2026", the default way the field reads its date. */
const words = (day: Day): string => {
  const [y, m, d] = parts(day);
  return `${WEEKDAYS[weekday(day)]!.slice(0, 3)} ${d} ${SHORT_MONTHS[m - 1]} ${y}`;
};

/**
 * One calendar date chosen from a month: the field `Select` draws, saying the date in words,
 * and a month grid on the menus' floating surface in the top layer. `value` and
 * `onValueChange` are `YYYY-MM-DD`; `min` and `max` bound what can be chosen, and days outside
 * them are drawn and passed over. In the grid the arrows move a day or a week, Page Up and Page
 * Down a month (with Shift a year), Home and End the start and end of the week, Enter or Space
 * chooses and Escape closes, the focus going back to the field. Today is ringed, the chosen day
 * filled with ink, today being `today` where the caller counts it in another zone. `format` says
 * the date another way in the field; `name` posts it. `lead` names the choice inside the field
 * before its value, as `Select`'s does, and draws `Select`'s caret, so it sits in a row of
 * selects as one of them; `none` is a first choice over the month that takes the day away,
 * chosen as `""`, Tab and Shift Tab moving between it and the month.
 */
export function DatePicker(props: {
  label?: ReactNode;
  "aria-label"?: string;
  value: Day | null;
  onValueChange?: (value: Day) => void;
  min?: Day | undefined;
  max?: Day | undefined;
  /** Today as the caller counts it (an organization's zone); the browser's own day where not given. */
  today?: Day | undefined;
  placeholder?: string;
  format?: (value: Day) => string;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  disabledReason?: string | undefined;
  name?: string;
  id?: string;
  /** `sm` the dense size, `xs` the thin one (`--size-control-height-xs`). */
  size?: "sm" | "xs";
  surface?: SurfaceStyle;
  "aria-describedby"?: string;
  /** `text`: the date in words with no box, for a date set inside a line, as `Select`'s `text` look. */
  look?: "field" | "text";
  /** What the choice is, inside the field before its value ("Due"), as `Select`'s lead. */
  lead?: ReactNode;
  /** The words of a first choice that takes the day away ("No due day"), chosen as `""`. */
  none?: string;
  className?: string;
}) {
  const made = useId();
  const field = props.id ?? made;
  const grid = `${field}-grid`;
  const said = [describedBy(field, props.error, props.hint), props["aria-describedby"]].filter(Boolean).join(" ") || undefined;
  const value = isDay(props.value) ? props.value : null;
  const trigger = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const noneButton = useRef<HTMLButtonElement>(null);
  const held = useBlocked(props.disabled, props.disabledReason, trigger);
  const [open, setOpen] = useState(false);
  const [noneActive, setNoneActive] = useState(false);
  const now = isDay(props.today) ? props.today : today();
  const [focus, setFocus] = useState<Day>(() => value ?? now);

  const allowed = (day: Day) => (!props.min || day >= props.min) && (!props.max || day <= props.max);
  const clamp = (day: Day) => (props.min && day < props.min ? props.min : props.max && day > props.max ? props.max : day);

  const show = () => {
    if (props.disabled) return;
    setFocus(clamp(value ?? now));
    setOpen(true);
  };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const choose = (day: Day) => {
    if (props.disabled || !allowed(day)) return;
    if (day !== value) props.onValueChange?.(day);
    close(true);
  };
  const chooseNone = () => {
    if (props.disabled) return;
    if (value !== null) props.onValueChange?.("");
    close(true);
  };

  useAnchored(open, () => trigger.current?.parentElement ?? null, pop, { placement: "bottom-start", fit: false, track: focus.slice(0, 7) });
  usePressAway(open, () => [trigger.current?.parentElement, pop.current], () => close(false));

  // An open editor must not be stranded when its owner disables the field.
  useEffect(() => {
    if (!props.disabled || !open) return;
    const inside = pop.current?.contains(document.activeElement);
    setOpen(false);
    if (inside && props.disabledReason) trigger.current?.focus();
  }, [props.disabled, props.disabledReason, open]);

  // The focused day takes the focus as it moves, so the keys and a screen reader follow it.
  useEffect(() => {
    if (open) pop.current?.querySelector<HTMLElement>(`[data-day="${focus}"]`)?.focus();
  }, [open, focus]);

  const keyed = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        return close(true);
      case "Tab": {
        // Between the first choice and the month, the focus moves; past either end, it closes.
        const onNone = event.target === noneButton.current;
        if (props.none && onNone !== event.shiftKey) {
          event.preventDefault();
          if (onNone) pop.current?.querySelector<HTMLElement>(`[data-day="${focus}"]`)?.focus();
          else noneButton.current?.focus();
          return;
        }
        return close(false);
      }
    }
  };

  const [year, month] = parts(monthStart(focus));

  const classes = [props.look === "text" ? "ui-field-text" : "ui-field", props.size === "sm" ? "ui-field-sm" : props.size === "xs" ? "ui-field-sm ui-field-xs" : "", props.className ?? ""].filter(Boolean).join(" ");
  return (
    <div data-ui-surface={props.surface} className={classes}>
      <FieldHead field={field} label={props.label} labelId={`${field}-label`} error={props.error} />
      <div className="ui-field-box ui-select-box" data-invalid={props.error ? "" : undefined} data-open={open ? "" : undefined} data-disabled={props.disabled ? "" : undefined}>
        <button
          id={field}
          type="button"
          className="ui-field-input ui-select ui-date"
          aria-label={props["aria-label"] ? (value ? `${props["aria-label"]}: ${words(value)}` : props["aria-label"]) : undefined}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? grid : undefined}
          aria-invalid={props.error ? true : undefined}
          {...held.props}
          aria-describedby={[said, reasonOf(held.props)["aria-describedby"]].filter(Boolean).join(" ") || undefined}
          data-empty={value || props.lead ? undefined : ""}
          onClick={unlessHeld(props.disabled, reasonOf(held.props).onClick, () => (open ? close(false) : show()))}
          onKeyDown={unlessHeld(props.disabled, reasonOf(held.props).onKeyDown, (event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key !== "ArrowDown" || open) return;
            event.preventDefault();
            show();
          })}
        >
          {props.lead ? <span className="ui-select-lead">{props.lead}</span> : null}
          <span className="ui-select-words">{value ? (props.format ? props.format(value) : words(value)) : (props.placeholder ?? "")}</span>
        </button>
        {props.look === "text" || props.lead ? <ChevronDownIcon size={props.lead ? 16 : 14} className="ui-select-caret" aria-hidden="true" /> : <CalendarEventIcon size={16} className="ui-select-caret ui-date-mark" aria-hidden="true" />}
        {held.node}
        {props.name ? <input type="hidden" name={props.name} value={value ?? ""} /> : null}
      </div>
      {open ? (
        <div ref={pop} id={grid} role="dialog" popover="manual" aria-modal="false" aria-label={`Choose a date, ${MONTHS[month - 1]} ${year}`} className="ui-menu ui-date-pop" onKeyDown={keyed}>
          {props.none ? (
            <button
              ref={noneButton}
              type="button"
              className="ui-menu-item ui-date-none"
              aria-pressed={value === null}
              data-active={noneActive ? "" : undefined}
              onPointerEnter={() => setNoneActive(true)}
              onPointerLeave={() => setNoneActive(false)}
              onFocus={() => setNoneActive(true)}
              onBlur={() => setNoneActive(false)}
              onClick={chooseNone}
            >
              <CheckMark checked={value === null} className="ui-date-none-mark" />
              <span className="ui-menu-words">{props.none}</span>
            </button>
          ) : null}
          <MonthGrid focus={focus} onFocusChange={setFocus} value={value} onChoose={choose} min={props.min} max={props.max} today={now} />
        </div>
      ) : null}
      <FieldHint field={field} hint={props.hint} />
    </div>
  );
}

/**
 * A month of days to choose one from: the month in words between its arrows, then six weeks
 * from the Monday on or before its first, so it keeps one height. The month shown is the one
 * `focus` is in. The keys move as a grid's do: the arrows a day or a week, Page Up and Page
 * Down a month (with Shift a year), Home and End the start and end of the week, Enter or Space
 * chooses. Today is ringed and the chosen day filled; days outside `min` and `max` are drawn
 * and passed over. DatePicker opens one, and the calendar keeps one in its side column.
 */
export function MonthGrid(props: { focus: Day; onFocusChange: (day: Day) => void; value: Day | null; onChoose: (day: Day) => void; min?: Day | undefined; max?: Day | undefined; today: Day; className?: string }) {
  const { focus } = props;
  const box = useRef<HTMLDivElement>(null);
  const allowed = (day: Day) => (!props.min || day >= props.min) && (!props.max || day <= props.max);
  const clamp = (day: Day) => (props.min && day < props.min ? props.min : props.max && day > props.max ? props.max : day);

  // While the keys are in the grid, the focus follows the focused day.
  useEffect(() => {
    const el = box.current;
    if (el?.contains(document.activeElement) && (document.activeElement as HTMLElement).dataset.day) el.querySelector<HTMLElement>(`[data-day="${focus}"]`)?.focus();
  }, [focus]);

  const keyed = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target as HTMLElement).dataset.day) return;
    const move = (to: Day) => {
      event.preventDefault();
      props.onFocusChange(clamp(to));
    };
    switch (event.key) {
      case "ArrowLeft":
        return move(addDays(focus, -1));
      case "ArrowRight":
        return move(addDays(focus, 1));
      case "ArrowUp":
        return move(addDays(focus, -7));
      case "ArrowDown":
        return move(addDays(focus, 7));
      case "PageUp":
        return move(addMonths(focus, event.shiftKey ? -12 : -1));
      case "PageDown":
        return move(addMonths(focus, event.shiftKey ? 12 : 1));
      case "Home":
        return move(addDays(focus, -weekday(focus)));
      case "End":
        return move(addDays(focus, 6 - weekday(focus)));
      case "Enter":
      case " ":
        event.preventDefault();
        if (allowed(focus)) props.onChoose(focus);
        return;
    }
  };

  const first = monthStart(focus);
  const start = addDays(first, -weekday(first));
  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
  const [year, month] = parts(first);
  const after = addMonths(first, 1);
  const mayBefore = !props.min || addDays(first, -1) >= props.min;
  const mayAfter = !props.max || after <= props.max;

  return (
    <div ref={box} className={props.className ? `ui-date-month-grid ${props.className}` : "ui-date-month-grid"} onKeyDown={keyed}>
      <div className="ui-date-head">
        <button type="button" className="ui-date-step" aria-label="The month before" disabled={!mayBefore} onClick={() => props.onFocusChange(clamp(addMonths(first, -1)))}>
          <ChevronRightIcon size={15} className="ui-date-back" aria-hidden="true" />
        </button>
        <span className="ui-date-month" aria-live="polite">
          {MONTHS[month - 1]} {year}
        </span>
        <button type="button" className="ui-date-step" aria-label="The month after" disabled={!mayAfter} onClick={() => props.onFocusChange(clamp(after))}>
          <ChevronRightIcon size={15} aria-hidden="true" />
        </button>
      </div>
      <table role="grid" className="ui-date-grid" aria-label={`${MONTHS[month - 1]} ${year}`}>
        <thead>
          <tr>
            {WEEKDAYS.map((name) => (
              <th key={name} scope="col" abbr={name} className="ui-date-weekday">
                {name.slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]}>
              {week.map((day) => {
                const inMonth = day.slice(0, 7) === first.slice(0, 7);
                const may = allowed(day);
                return (
                  <td key={day} role="gridcell" aria-selected={day === props.value}>
                    <button
                      type="button"
                      className="ui-date-day"
                      data-day={day}
                      data-outside={inMonth ? undefined : ""}
                      data-today={day === props.today ? "" : undefined}
                      data-chosen={day === props.value ? "" : undefined}
                      tabIndex={day === focus ? 0 : -1}
                      aria-label={words(day)}
                      aria-current={day === props.today ? "date" : undefined}
                      aria-disabled={may ? undefined : true}
                      onClick={() => (may ? props.onChoose(day) : props.onFocusChange(day))}
                    >
                      {parts(day)[2]}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
