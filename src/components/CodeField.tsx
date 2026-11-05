import { useId, useState, type ReactNode } from "react";
import { FieldHead } from "./FieldHead";

/**
 * Six digits, typed into six cells, with a text caret drawn in the next one: the calm register's
 * one field for a code somebody was sent.
 *
 * The cells are a drawing. The field underneath is a native input laid over them with its own
 * text made transparent and a letter-spacing wide enough to sit each digit in a cell, so a
 * phone's one-time-code suggestion, a password manager, pasting and a screen reader all meet an
 * ordinary input; that leaves the native caret nowhere useful, so the caret is drawn too. Only
 * digits are kept, six at most, whatever is typed or pasted. The next cell is ringed in the
 * place's colour (`--hue-ink`, from `data-hue` around it) and in ink without one. A short
 * `error` takes the label's place and rings every cell in the danger ink, as the library's
 * fields do (`FieldHead`), so nothing moves. In the focus layout's column the cells take its
 * width; anywhere else they keep their own.
 */
export function CodeField(props: { label: string; value: string; onChange: (value: string) => void; autoFocus?: boolean; disabled?: boolean; error?: ReactNode }) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const next = props.value.length;

  return (
    <div className="ui-code-field-root">
      <FieldHead field={id} label={props.label} labelId={`${id}-label`} error={props.error} />
      <div className={focused ? "ui-code-field-control is-focused" : "ui-code-field-control"} data-invalid={props.error ? "" : undefined}>
        <div className="ui-code-field-cells" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className={index === next && focused ? "ui-code-field-cell is-next" : index < next ? "ui-code-field-cell is-filled" : "ui-code-field-cell"}>
              {props.value[index] ?? (index === next && focused ? <span className="ui-code-field-cursor" /> : null)}
            </span>
          ))}
        </div>
        <input
          id={id}
          aria-labelledby={`${id}-label`}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={props.error ? `${id}-error` : undefined}
          className="ui-code-field-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus={props.autoFocus}
          disabled={props.disabled}
          maxLength={6}
          value={props.value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPaste={(event) => {
            if (props.disabled) return;
            // Normalize before the native maxlength truncates a formatted code.
            const digits = event.clipboardData.getData("text").replace(/\D/g, "");
            if (!digits) return;
            event.preventDefault();
            const input = event.currentTarget;
            const start = input.selectionStart ?? props.value.length;
            const end = input.selectionEnd ?? start;
            props.onChange(`${props.value.slice(0, start)}${digits}${props.value.slice(end)}`.slice(0, 6));
          }}
          onChange={(e) => props.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
      </div>
    </div>
  );
}
