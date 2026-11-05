import { Children, cloneElement, isValidElement, type ComponentProps, type ReactElement } from "react";

type SurfaceProps = ComponentProps<"div"> & { asChild?: boolean };
type SurfaceChild = ReactElement<ComponentProps<"div"> & { "data-vic-surface"?: string }>;

/** Share Vic's actual rendering with an external focus or positioning controller. */
function Surface({ asChild, children, className, kind, ...props }: SurfaceProps & { kind: string }) {
  const classes = [kind === "menu" ? "ui-menu ui-menu-actions" : kind === "popover" ? "ui-menu ui-popover" : `ui-${kind}`, className].filter(Boolean).join(" ");
  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement(child)) throw new Error("A Vic surface requires one element child.");
    const element = child as SurfaceChild;
    return cloneElement(element, { ...props, ...element.props, className: [classes, element.props.className].filter(Boolean).join(" "), "data-vic-surface": kind });
  }
  return <div {...props} className={classes} data-vic-surface={kind}>{children}</div>;
}

/** The same lifted frame used by Vic's native Dialog; the controller owns focus and closing. */
export function DialogSurface(props: SurfaceProps) { return <Surface {...props} kind="dialog" />; }
/** The same compact action surface used by Vic's Menu. */
export function MenuSurface(props: SurfaceProps) { return <Surface {...props} kind="menu" />; }
/** The same padded floating surface used by Vic's Popover. */
export function PopoverSurface(props: SurfaceProps) { return <Surface {...props} kind="popover" />; }
/** The same inverse label surface used by Vic's Tooltip. */
export function TooltipSurface(props: SurfaceProps) { return <Surface {...props} kind="tooltip" />; }
/** A dialog's title and supporting text, with the library's shared inset. */
export function DialogHeading(props: SurfaceProps) { return <Surface {...props} kind="dialog-head" />; }
/** A dialog's actions, divided from its body on a quiet fill. */
export function DialogActions(props: SurfaceProps) { return <Surface {...props} kind="dialog-foot" />; }

/** Native scrolling keeps browser wheel, keyboard and touch behavior and Vic's scrollbar. */
export function ScrollArea({ children, className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="scroll-area" className={["ui-scroll-area", className].filter(Boolean).join(" ")}><div data-slot="scroll-area-viewport" className="ui-scroll-area-viewport">{children}</div></div>;
}
