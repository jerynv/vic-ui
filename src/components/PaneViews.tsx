import { createContext, useContext, type HTMLAttributes, type ReactNode } from "react";

const Active = createContext("");

/**
 * Two or more surfaces sharing one pane, the one named by `active` shown and the others hidden
 * in place, so changing which swaps it at once with nothing moving (the owner's call, 2026-10-29).
 * Every view stays mounted, so a finder keeps what was typed in it and a conversation its scroll;
 * a hidden view is `inert` and out of a screen reader's way.
 */
export function PaneViews({ active, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { active: string; children: ReactNode }) {
  return (
    <Active.Provider value={active}>
      <div className={className ? `ui-pane-views ${className}` : "ui-pane-views"} {...rest}>
        {children}
      </div>
    </Active.Provider>
  );
}

/** One surface of `PaneViews`, named by `value`. */
export function PaneView({ value, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { value: string; children?: ReactNode }) {
  const on = useContext(Active) === value;
  return (
    <div {...rest} className={className ? `ui-pane-view ${className}` : "ui-pane-view"} data-value={value} hidden={!on} inert={!on}>
      {children}
    </div>
  );
}
