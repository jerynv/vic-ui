import type { ButtonHTMLAttributes } from "react";
import { useBlocked } from "./reason";

/**
 * One of a row of choices, a day or a time: a native button that says whether it is the one
 * chosen (`chosen`, read out as pressed). Unchosen it is the field's fill, as a box to type in
 * is; chosen it is the filled button (`Button`'s rim and face), so the one picked reads as the
 * one primary thing in the row, and the change between them eases rather than snaps.
 */
export function Choice({ chosen, className, type = "button", children, disabled, disabledReason, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { chosen: boolean; disabledReason?: string | undefined }) {
  const held = useBlocked<HTMLButtonElement>(disabled, disabledReason);
  return (
    <>
      <button type={type} className={className ? `ui-button ui-choice ${className}` : "ui-button ui-choice"} aria-pressed={chosen} {...rest} {...held.props}>
        <span className="ui-button-face">{children}</span>
      </button>
      {held.node}
    </>
  );
}
