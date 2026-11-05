import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { DateInput, DateSegment, TimeField as AriaTimeField } from "react-aria-components";
import { Button } from "./Button";
import { Popover } from "./Popover";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useBlocked } from "./reason";
import { reasonOf, unlessHeld } from "./held";
import { ClockIcon } from "../icons/icons";
import { timePickerValue, timePickerWireValue } from "./time-support/timePicker";

export interface TimePickerProps {
  /** Exact HH:MM, or an empty string. Invalid controlled strings display empty. */
  value: string;
  onValueChange: (value: string) => void;
  /** Inclusive HH:MM bounds within one day; reversed/invalid bounds prevent selection. */
  min?: string;
  max?: string;
  id?: string;
  name?: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  "aria-label"?: string;
  "aria-describedby"?: string;
  size?: "sm";
  none?: string;
  disabled?: boolean;
  disabledReason?: string | undefined;
}

/** Exact 24-hour wall time, with the canonical React Aria hour/minute segments. No date or zone. */
export function TimePicker(props: TimePickerProps) {
  const generated = useId();
  const field = props.id ?? generated;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  // React Aria resets a half-typed segment whenever the value it is given is a new object.
  const time = useMemo(() => timePickerValue(props.value), [props.value]);
  const [draft, setDraft] = useState(time);
  const min = useMemo(() => props.min === undefined ? null : timePickerValue(props.min), [props.min]);
  const max = useMemo(() => props.max === undefined ? null : timePickerValue(props.max), [props.max]);
  const badBounds = (props.min !== undefined && !min) || (props.max !== undefined && !max) || Boolean(min && max && min.compare(max) > 0);
  const outside = Boolean(draft && ((min && draft.compare(min) < 0) || (max && draft.compare(max) > 0)));
  const boundsReason = badBounds ? "The time bounds are not valid." : `Choose a time from ${props.min ?? "00:00"} to ${props.max ?? "23:59"}.`;
  const changeOpen = (next: boolean) => {
    if (next && props.disabled) return;
    if (next) setDraft(time);
    setOpen(next);
  };
  // A disabled segment loses focus; close instead of leaving an unreachable editor open.
  useEffect(() => {
    if (!props.disabled || !open) return;
    setOpen(false);
    trigger.current?.focus();
  }, [props.disabled, open]);
  const held = useBlocked(props.disabled, props.disabledReason);
  const said = [props["aria-describedby"], describedBy(field, props.error, props.hint, reasonOf(held.props)["aria-describedby"])].filter(Boolean).join(" ") || undefined;
  const words = time ? props.value : (props.none ?? "Choose a time");
  return (
    <div className={props.size === "sm" ? "ui-field ui-field-sm" : "ui-field"}>
      <FieldHead field={field} label={props.label} labelId={`${field}-label`} error={props.error} />
      {props.name ? <input type="hidden" name={props.name} value={timePickerWireValue(time)} /> : null}
      <Popover
        open={open}
        onOpenChange={changeOpen}
        aria-label="Choose a time"
        className="ui-time-picker"
        trigger={({ ref, onClick, ...pop }) => (
          <div className="ui-field-box ui-select-box" data-open={open ? "" : undefined} data-invalid={props.error ? "" : undefined} data-disabled={props.disabled ? "" : undefined}>
            <button
              {...pop}
              id={field}
              type="button"
              className="ui-field-input ui-select"
              aria-label={props["aria-label"] ? `${props["aria-label"]}: ${words}` : undefined}
              {...held.props}
              aria-labelledby={!props["aria-label"] && props.label ? `${field}-label ${field}-value` : undefined}
              aria-describedby={said}
              aria-invalid={props.error ? true : undefined}
              ref={(el) => {
                ref(el);
                trigger.current = el;
                if (typeof held.props.ref === "function") held.props.ref(el);
              }}
              data-empty={time || props.none ? undefined : ""}
              onClick={unlessHeld(props.disabled, reasonOf(held.props).onClick, onClick)}
              onKeyDown={unlessHeld(props.disabled, reasonOf(held.props).onKeyDown, (event: KeyboardEvent<HTMLElement>) => {
                if (event.key !== "ArrowDown" || open) return;
                event.preventDefault();
                changeOpen(true);
              })}
            >
              <span id={`${field}-value`} className="ui-select-words">{words}</span>
            </button>
            <ClockIcon size={16} className="ui-select-caret ui-time-mark" aria-hidden="true" />
            {held.node}
          </div>
        )}
      >
        <AriaTimeField
          value={draft}
          onChange={setDraft}
          className="ui-time-field"
          isDisabled={Boolean(props.disabled)}
          {...(min ? { minValue: min } : {})}
          {...(max ? { maxValue: max } : {})}
          validationBehavior="aria"
          granularity="minute"
          hourCycle={24}
          shouldForceLeadingZeros
          {...(props.label ? { "aria-labelledby": `${field}-label` } : { "aria-label": props["aria-label"] ?? "Time" })}
          {...(said ? { "aria-describedby": said } : {})}
          autoFocus
        >
          {({ state }) => {
            const segments = state.segments.filter((segment) => segment.isEditable);
            const empty = segments.every((segment) => segment.isPlaceholder);
            const partial = !empty && segments.some((segment) => segment.isPlaceholder);
            const blocked = Boolean(props.disabled || partial || badBounds || (!empty && (outside || state.isInvalid)));
            const reason = props.disabled ? props.disabledReason : partial ? "Enter both the hour and minute." : badBounds || outside ? boundsReason : undefined;
            return <>
              <DateInput className="ui-time-segments">{(segment) => <DateSegment segment={segment} className="ui-time-segment" />}</DateInput>
              <div className="ui-time-actions">
                {props.none ? <Button look="quiet" disabled={props.disabled} onClick={() => { if (props.disabled) return; props.onValueChange(""); close(); }}>{props.none}</Button> : null}
                <Button look="line" disabled={blocked} disabledReason={reason} onClick={() => { if (blocked) return; props.onValueChange(empty ? "" : timePickerWireValue(draft)); close(); }}>Done</Button>
              </div>
            </>;
          }}
        </AriaTimeField>
      </Popover>
      <FieldHint field={field} hint={props.hint} />
    </div>
  );
}
