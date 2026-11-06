import type { ButtonHTMLAttributes } from "react";
import { useBlocked } from "./reason";
import { reasonOf } from "./held";

/**
 * Something on or off, said at once: a native button with the switch role, a track that fills
 * with ink and a knob that slides to the end when it is on. `onCheckedChange` is handed the
 * new state. Its name is its `aria-label`, or the words written beside it. `look="flat"`
 * removes the track's decorative rim while preserving its fill, knob and focus ring.
 * `tone="accent"` fills the track in the brand accent when it is on: a look, not a state.
 */
export function Switch({ checked, onCheckedChange, className, look = "rimmed", tone, type = "button", disabled, disabledReason, ...rest }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & { checked: boolean; onCheckedChange?: (checked: boolean) => void; disabledReason?: string | undefined; look?: "flat" | "rimmed"; tone?: "accent" | undefined }) {
  const held = useBlocked<HTMLButtonElement>(disabled, disabledReason);
  return (
    <>
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      className={["ui-switch", look === "flat" ? "ui-switch-flat" : "", tone === "accent" ? "ui-switch-accent" : "", className].filter(Boolean).join(" ")}
      onClick={() => onCheckedChange?.(!checked)}
      {...rest}
      {...held.props} aria-describedby={[rest["aria-describedby"], reasonOf(held.props)["aria-describedby"]].filter(Boolean).join(" ") || undefined}
    >
      <span className="ui-switch-knob" />
    </button>
    {held.node}
    </>
  );
}
