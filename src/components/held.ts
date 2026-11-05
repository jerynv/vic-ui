import type { KeyboardEvent, MouseEvent } from "react";

/**
 * A held control's own handler, run only while it is not held: held, the reason's handler runs
 * instead (it refuses the press and shows why), so a click, Enter or a typed letter on a held
 * Select or DatePicker chooses nothing. The reason's handlers are spread before the control's
 * own, which replace them, so the control composes them through this.
 */
export function unlessHeld<E>(disabled: boolean | undefined, reason: ((event: E) => void) | undefined, own: (event: E) => void): (event: E) => void {
  return (event) => {
    if (!disabled) return own(event);
    reason?.(event);
  };
}

/** The description and handlers `useBlocked` gives a held control, where it gives them. */
export function reasonOf(props: object): { "aria-describedby"?: string; onClick?: (event: MouseEvent<HTMLElement>) => void; onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void } {
  return props;
}
