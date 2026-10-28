import { autoUpdate, computePosition, flip, offset, shift, size, type Placement, type VirtualElement } from "@floating-ui/dom";
import { useEffect, useId, useLayoutEffect, useRef, type ReactElement, type ReactNode, type RefObject } from "react";

/** The tallest any floating list stands, and the shortest it is squeezed to before it flips. */
export const LIST_MOST = 320;
export const LIST_LEAST = 120;

/** What a floating thing hangs from: an element, or a point on the screen (`atPoint`). */
export type Anchor = Element | VirtualElement;

/** A point as an anchor, for a menu opened where the right button was pressed. */
export function atPoint(x: number, y: number): VirtualElement {
  return { getBoundingClientRect: () => ({ x, y, left: x, top: y, right: x, bottom: y, width: 0, height: 0 }) };
}

/**
 * Puts `floating` into the top layer (`popover`) while `open`, and keeps it beside its anchor
 * as the page scrolls or resizes and as the anchor moves or changes size (`autoUpdate`). `fit` caps its height to the room on the side it opens on;
 * `track` is anything that, when it changes, should place it again (a new point, a new anchor).
 * Every floating piece of the library is placed by this.
 */
export function useAnchored(
  open: boolean,
  anchor: () => Anchor | null,
  floating: RefObject<HTMLElement | null>,
  how: { placement?: Placement; gap?: number; fit?: boolean; matchWidth?: boolean; track?: unknown } = {},
) {
  const { placement = "bottom-start", gap = 6, fit = true, matchWidth = false, track } = how;
  useLayoutEffect(() => {
    const at = anchor();
    const el = floating.current;
    if (!open || !at || !el) return;
    if (!el.matches(":popover-open")) el.showPopover();
    // Measured from the window's corner, so the room it is given is the window's and never
    // what is left between where it last stood and the window's edge, which squeezed a
    // tooltip on a button near the edge into a column a word wide.
    const place = () => {
      el.style.left = "0px";
      el.style.top = "0px";
      void computePosition(at, el, {
        strategy: "fixed",
        placement,
        middleware: [
          offset(gap),
          // Past the other side too (a popover set beside its trigger on a phone), it goes
          // above or below rather than off the window.
          flip({ padding: 8, fallbackAxisSideDirection: "end" }),
          shift({ padding: 8 }),
          ...(fit || matchWidth
            ? [
                size({
                  padding: 8,
                  apply({ rects, availableHeight }) {
                    if (matchWidth) el.style.minWidth = `${rects.reference.width}px`;
                    if (fit) el.style.maxHeight = `${Math.min(LIST_MOST, Math.max(LIST_LEAST, availableHeight))}px`;
                  },
                }),
              ]
            : []),
        ],
      }).then(({ x, y, placement: side }) => {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.dataset.side = side.split("-")[0];
      });
    };
    let stop: () => void;
    if (at instanceof Element) stop = autoUpdate(at, el, place);
    else {
      place();
      window.addEventListener("resize", place);
      stop = () => window.removeEventListener("resize", place);
    }
    return () => {
      stop();
      if (el.matches(":popover-open")) el.hidePopover();
    };
    // `anchor` is read when it opens; `track` says when to read it again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, gap, fit, matchWidth, track]);
}

/** Calls `away` on a press anywhere outside the given elements while `open`. */
export function usePressAway(open: boolean, inside: () => Array<Element | null | undefined>, away: () => void) {
  const latest = useRef(away);
  latest.current = away;
  useEffect(() => {
    if (!open) return;
    const press = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!inside().some((el) => el?.contains(target))) latest.current();
    };
    document.addEventListener("pointerdown", press, true);
    return () => document.removeEventListener("pointerdown", press, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

/** What a popover's trigger is given to spread on itself. */
export interface PopoverTriggerProps {
  ref: (el: HTMLElement | null) => void;
  "aria-haspopup": "dialog";
  "aria-expanded": boolean;
  "aria-controls": string;
  onClick: () => void;
}

/**
 * Free content hung from a trigger, on the menus' floating surface in the top layer. It is a
 * dialog that does not hold the page: a press outside it, Escape, or the focus leaving it and
 * its trigger closes it, and Escape puts the focus back on the trigger. On opening, the focus
 * goes to its first control (or to it). `trigger` is given the props to spread on the element
 * that opens it.
 */
export function Popover(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: (props: PopoverTriggerProps) => ReactElement;
  children: ReactNode;
  placement?: Placement;
  "aria-label"?: string;
  className?: string;
}) {
  const id = useId();
  const trigger = useRef<HTMLElement | null>(null);
  const pop = useRef<HTMLDivElement>(null);
  const { open, onOpenChange } = props;

  useAnchored(open, () => trigger.current, pop, { placement: props.placement ?? "bottom-start", fit: false });
  usePressAway(open, () => [trigger.current, pop.current], () => onOpenChange(false));

  // The focus goes in when it opens.
  useEffect(() => {
    const el = pop.current;
    if (!open || !el) return;
    const first = el.querySelector<HTMLElement>("[autofocus], button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex='-1'])");
    (first ?? el).focus();
  }, [open]);

  const close = (refocus: boolean) => {
    onOpenChange(false);
    if (refocus) trigger.current?.focus();
  };

  return (
    <>
      {props.trigger({
        ref: (el) => {
          trigger.current = el;
        },
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": id,
        onClick: () => onOpenChange(!open),
      })}
      {open ? (
        <div
          ref={pop}
          id={id}
          role="dialog"
          popover="manual"
          tabIndex={-1}
          aria-label={props["aria-label"]}
          className={["ui-menu ui-popover", props.className ?? ""].filter(Boolean).join(" ")}
          onKeyDown={(event) => {
            if (event.key !== "Escape" || event.defaultPrevented) return;
            event.preventDefault();
            event.stopPropagation();
            close(true);
          }}
          onBlur={(event) => {
            const next = event.relatedTarget as Node | null;
            if (next && !pop.current?.contains(next) && !trigger.current?.contains(next)) close(false);
          }}
        >
          {props.children}
        </div>
      ) : null}
    </>
  );
}
