import { useLayoutEffect, useRef, type ReactNode } from "react";

/** The way-in's measured height transition, shared with forms that change steps.
 * A stable remember key carries a height across remounts; other instances stay independent. */
const heights = new Map<string, number>();
export function Grow({ children, remember, contentKey, className, innerClassName }: { children: ReactNode; remember?: string; contentKey?: string; className?: string; innerClassName?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  useLayoutEffect(() => {
    const box = outer.current;
    const content = inner.current;
    if (!box || !content) return;
    const set = () => {
      const next = content.offsetHeight;
      box.style.height = `${next}px`;
      if (remember) heights.set(remember, next);
    };
    if (!initialized.current) {
      const previous = remember ? heights.get(remember) : undefined;
      if (previous) {
        box.style.height = `${previous}px`;
        box.getBoundingClientRect();
      }
      initialized.current = true;
    }
    set();
    const watch = new ResizeObserver(set);
    watch.observe(content);
    return () => watch.disconnect();
  }, [remember, contentKey]);
  return <div ref={outer} className={["ui-grow", className ?? ""].filter(Boolean).join(" ")}>
    <div key={contentKey} ref={inner} className={["ui-grow-inner", innerClassName ?? ""].filter(Boolean).join(" ")}>{children}</div>
  </div>;
}
