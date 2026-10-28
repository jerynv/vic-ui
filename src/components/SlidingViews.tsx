import { Children, createContext, isValidElement, useContext, type HTMLAttributes, type ReactNode } from "react";

const Active = createContext("");

/**
 * Two or more surfaces sharing one pane, the one named by `active` in view and the others slid
 * out to its sides, so changing which slides rather than jumps. A view out of sight is `inert`
 * and hidden from a screen reader. Under reduced motion it changes in place.
 */
export function SlidingViews({ active, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { active: string; children: ReactNode }) {
  const at = Math.max(
    0,
    Children.toArray(children).findIndex((child) => isValidElement<{ value?: string }>(child) && child.props.value === active),
  );
  return (
    <Active.Provider value={active}>
      <div className={className ? `ui-sliding ${className}` : "ui-sliding"} {...rest}>
        <div className="ui-sliding-track" style={{ transform: `translateX(${at * -100}%)` }}>
          {children}
        </div>
      </div>
    </Active.Provider>
  );
}

/** One surface of `SlidingViews`, named by `value`. */
export function SlidingView({ value, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { value: string; children?: ReactNode }) {
  const on = useContext(Active) === value;
  return (
    <div className={className ? `ui-sliding-view ${className}` : "ui-sliding-view"} data-value={value} aria-hidden={!on} inert={!on} {...rest}>
      {children}
    </div>
  );
}
