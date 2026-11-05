import type { ComponentProps } from "react";

/** Decorative loading placeholder; announce loading once on the containing region. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} aria-hidden="true" className={["ui-skeleton", className].filter(Boolean).join(" ")} />;
}
