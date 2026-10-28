import type { Placement } from "@floating-ui/dom";
import { forwardRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import { Button, ButtonLink } from "./Button";
import { Spinner } from "./Spinner";
import { Tooltip } from "./Tooltip";

/**
 * An icon alone that acts: a square `Button` whose words are its accessible name and its
 * tooltip (`tip` where the tooltip says more, a shortcut). `quiet` by default, a fill under the
 * pointer and while `aria-pressed`; `line` where it stands beside fields in a header. `busy`
 * turns the icon into a spinner and holds the press. A held one says its `disabledReason`
 * in place of its words. `keepFocus` keeps the focus where it was when it is pressed, as an
 * editor's formatting does, so the selection it acts on is not lost to the press.
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ComponentProps<typeof Button>, "square" | "children" | "icon" | "aria-label"> & { label: string; icon: ReactNode; tip?: ReactNode; busy?: boolean; placement?: Placement; keepFocus?: boolean }
>(function IconButton({ label, icon, tip, busy, placement, keepFocus, look = "quiet", disabled, disabledReason, onMouseDown, ...rest }, ref) {
  const held = !!(disabled && disabledReason);
  const press = keepFocus
    ? (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onMouseDown?.(event);
      }
    : onMouseDown;
  const button = <Button ref={ref} look={look} square icon={busy ? <Spinner /> : icon} aria-label={label} aria-busy={busy || undefined} disabled={disabled || busy} disabledReason={disabledReason} {...(press ? { onMouseDown: press } : {})} {...rest} />;
  if (held) return button;
  return (
    <Tooltip content={tip ?? label} {...(placement ? { placement } : {})}>
      {button}
    </Tooltip>
  );
});

/**
 * The same icon alone on a link: to a page of this app by `to` (with `state`), or anywhere
 * else by `href` (a download names its file with `download`). Its words are its accessible
 * name and its tooltip, as an `IconButton`'s are, and it is never underlined.
 */
export function IconButtonLink(
  props: Omit<ComponentProps<typeof ButtonLink>, "square" | "children" | "icon" | "aria-label"> & { label: string; icon: ReactNode; tip?: ReactNode; busy?: boolean; placement?: Placement },
) {
  const { label, icon, tip, busy, placement, look = "quiet", className, ...rest } = props;
  return (
    <Tooltip content={tip ?? label} {...(placement ? { placement } : {})}>
      <ButtonLink look={look} square icon={busy ? <Spinner /> : icon} aria-label={label} aria-busy={busy || undefined} className={className} {...rest} />
    </Tooltip>
  );
}
