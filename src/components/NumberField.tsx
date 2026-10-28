import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useFieldReason } from "./reason";

/**
 * A number typed as words: the field's box with what is fixed before it (`prefix`, a `$`) and
 * after it (`suffix`, "per hour") inside, the decimal keyboard on a phone, and the text given
 * whole to `onValueChange`, so a page decides what it accepts and says so in `error` rather
 * than the field dropping what was typed. Its digits are tabular, so a number does not
 * change width as it is typed.
 */
export const NumberField = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange" | "type" | "prefix"> & {
    value: string;
    onValueChange: (value: string) => void;
    label?: ReactNode;
    "aria-label"?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    /** Whole numbers only: the numeric keyboard rather than the decimal one. */
    whole?: boolean;
    size?: "sm";
    disabledReason?: string | undefined;
  }
>(function NumberField({ value, onValueChange, label, prefix, suffix, hint, error, whole, size, className, id, disabled, disabledReason, onFocus, onBlur, onKeyDown, ...rest }, ref) {
  const made = useId();
  const field = id ?? made;
  const why = useFieldReason(disabled, disabledReason);
  const held = why.held;
  const said = describedBy(field, error, hint, why.describedBy);
  const classes = ["ui-field", size === "sm" ? "ui-field-sm" : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      <FieldHead field={field} label={label} error={error} />
      <div ref={why.anchor} className="ui-field-box ui-number-box" data-invalid={error ? "" : undefined} data-disabled={disabled || held ? "" : undefined} {...why.box}>
        {prefix ? (
          <span className="ui-field-prefix" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          {...rest}
          ref={ref}
          id={field}
          type="text"
          inputMode={whole ? "numeric" : "decimal"}
          autoComplete="off"
          className="ui-field-input ui-number"
          data-prefixed={prefix ? "" : undefined}
          value={value}
          disabled={held ? undefined : disabled}
          readOnly={held || rest.readOnly}
          aria-disabled={held ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={said}
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
          onChange={(event) => {
            if (!held) onValueChange(event.target.value);
          }}
        />
        {suffix ? <span className="ui-field-suffix">{suffix}</span> : null}
        {why.node}
      </div>
      <FieldHint field={field} hint={hint} />
    </div>
  );
});
