import type { ChangeEvent, MouseEvent, ReactNode } from "react";
import type { ButtonLook } from "./Button";
import { useTip } from "./Tooltip";

/**
 * A button that chooses a file: a label drawn as a `Button` (`line` by default), the file input
 * inside it and hidden, so the keyboard reaches it as the pointer does and its focus rings the
 * button. `label` is the input's accessible name. A held one (`disabled` with `disabledReason`)
 * stays in reach and says why on hover and focus, and choosing does nothing; without a reason
 * the input is disabled the native way. A file input keeps its own value, so a caller that
 * sends at once gives it a new `key` to empty it.
 */
export function FileButton(props: {
  children: ReactNode;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string | undefined;
  multiple?: boolean | undefined;
  name?: string | undefined;
  look?: ButtonLook | undefined;
  size?: "md" | "lg" | undefined;
  icon?: ReactNode;
  disabled?: boolean | undefined;
  disabledReason?: string | undefined;
  className?: string | undefined;
}) {
  const look = props.look ?? "line";
  const tip = useTip(props.disabled ? props.disabledReason : undefined);
  const held = tip.has;
  const refuse = (event: MouseEvent<HTMLInputElement>) => event.preventDefault();
  const className = ["ui-button", `ui-button-${look}`, props.size === "lg" ? "ui-button-lg" : "", "ui-file-button", props.className ?? ""].filter(Boolean).join(" ");
  return (
    <>
      <label
        ref={(el) => {
          tip.anchor.current = el;
        }}
        className={className}
        aria-disabled={props.disabled ? true : undefined}
        {...(held ? { onPointerEnter: tip.handlers.onPointerEnter, onPointerLeave: tip.handlers.onPointerLeave } : {})}
      >
        <span className="ui-button-face">
          {props.icon}
          {props.children}
        </span>
        <input
          type="file"
          className="sr-only"
          aria-label={props.label}
          accept={props.accept}
          multiple={props.multiple}
          name={props.name}
          disabled={props.disabled && !held}
          onChange={props.onChange}
          {...(held
            ? {
                "aria-disabled": true,
                "aria-describedby": tip.id,
                onClick: refuse,
                onFocus: tip.handlers.onFocus,
                onBlur: tip.handlers.onBlur,
                onKeyDown: tip.handlers.onKeyDown,
              }
            : {})}
        />
      </label>
      {tip.node}
    </>
  );
}
