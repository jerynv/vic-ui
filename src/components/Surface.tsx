import type { HTMLAttributes } from "react";

export type SurfaceStyle = "flat" | "bordered";
export type SurfaceProps = { surface?: SurfaceStyle | undefined };

/** A shared field/card appearance; nested scopes and individual controls can override it. */
export function Surface({ surface, ...props }: HTMLAttributes<HTMLDivElement> & SurfaceProps) {
  return <div data-ui-surface={surface} {...props} />;
}
