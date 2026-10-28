import type { Placement } from "@floating-ui/dom";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { Tooltip } from "./Tooltip";

/**
 * An icon alone that acts: a square `Button` whose words are its accessible name and its
 * tooltip (`tip` where the tooltip says more, a shortcut). `quiet` by default, a fill under the
 * pointer and while `aria-pressed`; `line` where it stands beside fields in a header. `busy`
 * turns the icon into a spinner and holds the press. A held one says its `disabledReason`
 * in place of its words.
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ComponentProps<typeof Button>, "square" | "children" | "icon" | "aria-label"> & { label: string; icon: ReactNode; tip?: ReactNode; busy?: boolean; placement?: Placement }
>(function IconButton({ label, icon, tip, busy, placement, look = "quiet", disabled, disabledReason, ...rest }, ref) {
  const held = !!(disabled && disabledReason);
  const button = <Button ref={ref} look={look} square icon={busy ? <Spinner /> : icon} aria-label={label} aria-busy={busy || undefined} disabled={disabled || busy} disabledReason={disabledReason} {...rest} />;
  if (held) return button;
  return (
    <Tooltip content={tip ?? label} {...(placement ? { placement } : {})}>
      {button}
    </Tooltip>
  );
});
