import type { ComponentPropsWithRef, ElementType } from "react";

export type WrappingRowProps<T extends ElementType = "div"> = { as?: T } & Omit<ComponentPropsWithRef<T>, "as">;

/**
 * A row whose content can take several lines, with independent actions left as siblings.
 * `as` keeps the caller's native element or link, props and ref, without adding a wrapper
 * or words slot. Alignment and wrapping stay with the content's layout classes.
 * `hit-row` is the compatibility alias for the console's panel, chevron and hover rules.
 * Styles: components/rows.css and unlayered.css, on the shared type and colour tokens.
 */
export function WrappingRow<T extends ElementType = "div">({ as, className, ...rest }: WrappingRowProps<T>) {
  const Component = as ?? "div";
  return <Component className={className ? `ui-wrapping-row hit-row ${className}` : "ui-wrapping-row hit-row"} {...rest} />;
}
