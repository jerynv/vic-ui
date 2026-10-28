import type { ButtonHTMLAttributes } from "react";
import { useBlocked } from "./reason";

/**
 * Something on or off, said at once: a native button with the switch role, a track that fills
 * with ink and a knob that slides to the end when it is on. `onCheckedChange` is handed the
 * new state. Its name is its `aria-label`, or the words written beside it.
 */
export function Switch({ checked, onCheckedChange, className, type = "button", disabled, disabledReason, ...rest }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & { checked: boolean; onCheckedChange?: (checked: boolean) => void; disabledReason?: string | undefined }) {
  const held = useBlocked<HTMLButtonElement>(disabled, disabledReason);
  return (
    <>
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      className={className ? `ui-switch ${className}` : "ui-switch"}
      onClick={() => onCheckedChange?.(!checked)}
      {...rest}
      {...held.props}
    >
      <span className="ui-switch-knob" />
    </button>
    {held.node}
    </>
  );
}
