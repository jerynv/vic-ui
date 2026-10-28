import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useFieldReason } from "./reason";

/**
 * The library's field: a label, a native input, and what is fixed at its end (`suffix`, the
 * rest of a hostname) inside the same box. A short `error` takes the label's place and rings
 * the box (`FieldHead`), so nothing moves; a `hint` has its line under the box. Focus draws
 * the ring round the whole box, so a suffix reads as part of what is typed. Without `label` it
 * is named by `aria-label`; `size="sm"` is the dense one; `prefix` is fixed at its start. With
 * `disabled` and a `disabledReason` it is not natively disabled: it stays focusable, takes no
 * words and says why, as every other field here does (`useFieldReason`).
 */
export const TextField = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> & { label?: ReactNode; "aria-label"?: string; suffix?: ReactNode; prefix?: ReactNode; hint?: ReactNode; error?: ReactNode; size?: "sm"; disabledReason?: string | undefined }
>(function TextField({ label, suffix, prefix, hint, error, size, className, id, disabled, disabledReason, onFocus, onBlur, onKeyDown, ...rest }, ref) {
  const made = useId();
  const field = id ?? made;
  const why = useFieldReason(disabled, disabledReason);
  const held = why.held;
  return (
    <div className={["ui-field", size === "sm" ? "ui-field-sm" : "", className ?? ""].filter(Boolean).join(" ")}>
      <FieldHead field={field} label={label} error={error} />
      <div ref={why.anchor} className="ui-field-box" data-invalid={error ? "" : undefined} data-disabled={held ? "" : undefined} {...why.box}>
        {prefix ? <span className="ui-field-prefix">{prefix}</span> : null}
        <input
          ref={ref}
          id={field}
          className="ui-field-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(field, error, hint, why.describedBy)}
          {...rest}
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
        />
        {suffix ? <span className="ui-field-suffix">{suffix}</span> : null}
        {why.node}
      </div>
      <FieldHint field={field} hint={hint} />
    </div>
  );
});
