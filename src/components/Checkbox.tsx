import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { CheckIcon } from "../icons/icons";
import { useBlocked } from "./reason";
import { reasonOf } from "./held";

/** The checkbox square inside a row that is already the control, without a nested input. */
export function CheckMark(props: { checked: boolean; className?: string }) {
  return (
    <span className={props.className ? `ui-check-box ${props.className}` : "ui-check-box"} aria-hidden="true">
      <span className="ui-check-face" data-checked={props.checked ? "" : undefined} />
      <CheckIcon size={13} className="ui-check-tick" aria-hidden="true" />
    </span>
  );
}

/**
 * A box to tick, with its words beside it: a native checkbox inside its label, so pressing
 * the words ticks it, the space bar toggles it and a screen reader reads the words as its
 * name, drawn by the page as a filled square that fills with ink and a tick when ticked.
 * `onCheckedChange` is handed the new state; `onChange` still has the event. Links inside the
 * words stay links. Without `label` it is the box alone, named by `aria-label`, for a row whose
 * own label holds it.
 */
export const Checkbox = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: ReactNode; onCheckedChange?: (checked: boolean) => void; disabledReason?: string | undefined }>(function Checkbox(
  { label, className, id, onCheckedChange, onChange, disabled, disabledReason, ...rest },
  ref,
) {
  const made = useId();
  const box = id ?? made;
  const held = useBlocked(disabled, disabledReason, ref);
  const Wrap = label === undefined ? "span" : "div";
  return (
    <Wrap className={className ? `ui-check ${className}` : "ui-check"}>
      <span className="ui-check-box">
        <input
          id={box}
          type="checkbox"
          onChange={(event) => {
            onChange?.(event);
            onCheckedChange?.(event.target.checked);
          }}
          {...rest}
          {...held.props}
          aria-describedby={[rest["aria-describedby"], reasonOf(held.props)["aria-describedby"]].filter(Boolean).join(" ") || undefined}
        />
        <CheckIcon size={13} className="ui-check-tick" aria-hidden="true" />
      </span>
      {label === undefined ? null : (
        <label htmlFor={box} className="ui-check-words">
          {label}
        </label>
      )}
      {held.node}
    </Wrap>
  );
});
