import { forwardRef, useCallback, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { MagnifyingGlassIcon, XIcon } from "../icons/icons";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useFieldReason } from "./reason";

/**
 * A search: the field's box with a glass at its start and, once it has words, a clear button
 * at its end, which empties it and puts the focus back. Escape empties it too, and only while
 * it has words, so the key otherwise goes on to the dialog or page around it. `value` and
 * `onValueChange` hold the words; `size="sm"` is the dense one a page header carries.
 */
export const SearchField = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange" | "type"> & {
    value: string;
    onValueChange: (value: string) => void;
    label?: ReactNode;
    "aria-label"?: string;
    hint?: ReactNode;
    error?: ReactNode;
    /** What the clear button says to a screen reader. */
    clearLabel?: string;
    size?: "sm";
    disabledReason?: string | undefined;
  }
>(function SearchField({ value, onValueChange, label, hint, error, clearLabel = "Clear the search", size, className, id, disabled, disabledReason, onKeyDown, onFocus, onBlur, ...rest }, ref) {
  const made = useId();
  const field = id ?? made;
  const why = useFieldReason(disabled, disabledReason);
  const held = why.held;
  const said = describedBy(field, error, hint, why.describedBy);
  const own = useRef<HTMLInputElement | null>(null);
  const join = useCallback(
    (node: HTMLInputElement | null) => {
      own.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  const clear = () => {
    onValueChange("");
    own.current?.focus();
  };

  const classes = ["ui-field", size === "sm" ? "ui-field-sm" : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={classes} role="search">
      <FieldHead field={field} label={label} error={error} />
      <div ref={why.anchor} className="ui-field-box ui-search-box" data-invalid={error ? "" : undefined} data-disabled={disabled || held ? "" : undefined} {...why.box}>
        <MagnifyingGlassIcon size={size === "sm" ? 14 : 16} className="ui-search-glass" aria-hidden="true" />
        <input
          {...rest}
          ref={join}
          id={field}
          type="search"
          className="ui-field-input ui-search"
          value={value}
          disabled={held ? undefined : disabled}
          readOnly={held || rest.readOnly}
          aria-disabled={held ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={said}
          onChange={(event) => {
            if (!held) onValueChange(event.target.value);
          }}
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
            if (event.key === "Escape" && value !== "" && !held) {
              event.preventDefault();
              event.stopPropagation();
              onValueChange("");
            }
          }}
        />
        {value && !disabled && !held ? (
          <button type="button" className="ui-search-clear" aria-label={clearLabel} onClick={clear}>
            <XIcon size={size === "sm" ? 13 : 14} aria-hidden="true" />
          </button>
        ) : null}
        {why.node}
      </div>
      <FieldHint field={field} hint={hint} />
    </div>
  );
});
