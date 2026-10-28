import { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode, type TextareaHTMLAttributes } from "react";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useFieldReason } from "./reason";

/**
 * Words over several lines, in the box `TextField` draws. `rows` sets its height; with `grow`
 * it grows with what is typed up to `maxRows` and scrolls past that. `onValueChange` gives the
 * words, and native `onChange` still passes through. With `maxLength` a count sits at the end
 * of the line under it, beside the hint, and that line is always drawn, so the count arriving
 * or a hint changing moves nothing below. A short `error` takes the label's place
 * (`FieldHead`). With `disabledReason` it is not natively disabled: it stays focusable, takes
 * no words and says why.
 */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
    label?: ReactNode;
    "aria-label"?: string;
    hint?: ReactNode;
    error?: ReactNode;
    onValueChange?: (value: string) => void;
    grow?: boolean;
    maxRows?: number;
    size?: "sm";
    disabledReason?: string | undefined;
  }
>(function Textarea({ label, hint, error, onValueChange, onChange, grow, maxRows = 8, rows = 3, size, className, id, value, defaultValue, maxLength, disabledReason, disabled, onFocus, onBlur, onKeyDown, ...rest }, ref) {
  const made = useId();
  const field = id ?? made;
  const why = useFieldReason(disabled, disabledReason);
  const held = why.held;
  const said = describedBy(field, error, hint, why.describedBy);
  const own = useRef<HTMLTextAreaElement | null>(null);
  const [typed, setTyped] = useState(() => String(defaultValue ?? ""));
  const length = (value === undefined ? typed : String(value)).length;

  const join = useCallback(
    (node: HTMLTextAreaElement | null) => {
      own.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Grown to its words between `rows` and `maxRows` lines, measured from its own line height.
  const fit = useCallback(() => {
    const box = own.current;
    if (!box || !grow) return;
    const style = getComputedStyle(box);
    const line = parseFloat(style.lineHeight) || 20;
    const pad = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    box.style.height = "auto";
    const most = line * maxRows + pad;
    box.style.height = `${Math.max(line * rows + pad, Math.min(box.scrollHeight, most))}px`;
    box.style.overflowY = box.scrollHeight > most ? "auto" : "hidden";
  }, [grow, maxRows, rows]);

  useLayoutEffect(fit, [fit, value]);

  const counted = maxLength !== undefined;
  const classes = ["ui-field", size === "sm" ? "ui-field-sm" : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      <FieldHead field={field} label={label} error={error} />
      <div ref={why.anchor} className="ui-field-box ui-textarea-box" data-invalid={error ? "" : undefined} data-disabled={disabled || held ? "" : undefined} {...why.box}>
        <textarea
          {...rest}
          ref={join}
          id={field}
          rows={rows}
          className="ui-field-input ui-textarea"
          data-grow={grow ? "" : undefined}
          disabled={held ? undefined : disabled}
          readOnly={held || rest.readOnly}
          aria-disabled={held ? true : undefined}
          onFocus={(event) => {
            onFocus?.(event);
            why.focus(event);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            why.blur();
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            why.key(event);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={said}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={(event) => {
            if (value === undefined) setTyped(event.target.value);
            onChange?.(event);
            onValueChange?.(event.target.value);
            if (value === undefined) fit();
          }}
        />
        {why.node}
      </div>
      {counted ? (
        <div className="ui-field-foot">
          <p id={`${field}-hint`} className="ui-field-hint">
            {hint}
          </p>
          <span className="ui-field-count" data-full={length >= maxLength ? "" : undefined} aria-live="polite">
            {length} of {maxLength}
          </span>
        </div>
      ) : (
        <FieldHint field={field} hint={hint} />
      )}
    </div>
  );
});
