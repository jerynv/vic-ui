import type { Placement } from "@floating-ui/dom";
import { cloneElement, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactElement, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";
import { useAnchored } from "./Popover";

/** How long the pointer rests on something before its tooltip shows. */
export const TIP_DELAY_MS = 500;

// Once one tooltip has shown, the next shows at once while the pointer moves along a row.
let warmUntil = 0;

/**
 * The tooltip every piece shares: shown after a rest of the pointer or at once on keyboard
 * focus, hidden on leaving, on a press and on Escape. It is in the top layer, as wide as its
 * words up to 18rem, flipped and shifted to stay in the window and placed again whenever its
 * trigger moves. `anchor` is set to the element it hangs
 * from; `show` and `hide` are for a piece that moves its own focus (a menu's items).
 */
export function useTip(content: ReactNode, how: { placement?: Placement | undefined; delay?: number | undefined } = {}) {
  const id = useId();
  const anchor = useRef<HTMLElement | null>(null);
  const tip = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [turn, setTurn] = useState(0);
  const has = content !== undefined && content !== null && content !== false && content !== "";

  useAnchored(open && has, () => anchor.current, tip, { placement: how.placement ?? "top", gap: 6, fit: false, track: turn });
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (now = false) => {
    window.clearTimeout(timer.current);
    if (!has) return;
    const go = () => {
      setTurn((n) => n + 1);
      setOpen(true);
    };
    if (now || performance.now() < warmUntil) go();
    else timer.current = window.setTimeout(go, how.delay ?? TIP_DELAY_MS);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen((was) => {
      if (was) warmUntil = performance.now() + 400;
      return false;
    });
  };

  // Drawn at the foot of the body rather than beside its trigger, so no rule about the
  // trigger's parent (a grid's cells, `> *`, an overflow) can size, clip or hide it.
  const node = has
    ? createPortal(
        <>
          <span id={id} hidden>
            {content}
          </span>
          {open ? (
            <div ref={tip} popover="manual" role="tooltip" aria-hidden="true" className="ui-tooltip">
              {content}
            </div>
          ) : null}
        </>,
        document.body,
      )
    : null;

  /** The handlers a trigger carries: the pointer (never touch), keyboard focus, Escape. */
  const handlers = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "touch") show();
    },
    onPointerLeave: () => hide(),
    onPointerDown: () => hide(),
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible")) show(true);
    },
    onBlur: () => hide(),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        event.stopPropagation();
        hide();
      }
    },
  };

  return { id, anchor, open, show, hide, node, handlers, has };
}

type Handlers = ReturnType<typeof useTip>["handlers"];
type TriggerProps = { [K in keyof Handlers]?: (event: never) => void } & { ref?: Ref<HTMLElement> | undefined; "aria-describedby"?: string | undefined };

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * A word or two in ink beside a control, on hover after a short rest and on keyboard focus,
 * never on touch. `children` is the one element it describes, given the handlers and
 * `aria-describedby` alongside its own.
 */
export function Tooltip(props: { content: ReactNode; children: ReactElement<TriggerProps>; placement?: Placement; delay?: number }) {
  const tip = useTip(props.content, { placement: props.placement, delay: props.delay });
  const own = props.children.props;
  const joined = Object.fromEntries(
    (Object.keys(tip.handlers) as Array<keyof Handlers>).map((key) => [
      key,
      (event: never) => {
        (own[key] as ((event: never) => void) | undefined)?.(event);
        (tip.handlers[key] as (event: never) => void)(event);
      },
    ]),
  );
  return (
    <>
      {cloneElement(props.children, {
        ...joined,
        ref: (el: HTMLElement | null) => {
          tip.anchor.current = el;
          setRef(own.ref, el);
        },
        "aria-describedby": tip.has ? [own["aria-describedby"], tip.id].filter(Boolean).join(" ") : own["aria-describedby"],
      })}
      {tip.node}
    </>
  );
}

/**
 * Why a control cannot be used, for any piece that takes `disabledReason`. With a reason the
 * control is not natively disabled: spread `props` on it last, so it is `aria-disabled`, stays
 * focusable and hoverable, ignores presses and the keys that would act, and shows the reason
 * in the tooltip on hover and on keyboard focus; render `node` beside it. Without a reason
 * `props` is empty and `node` is null, and the control is disabled the native way.
 */
export function useReason(reason?: string, how: { placement?: Placement | undefined } = {}) {
  const tip = useTip(reason, how);
  if (!reason) return { props: {}, node: null };
  const refuse = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return {
    props: {
      ref: (el: HTMLElement | null) => {
        tip.anchor.current = el;
      },
      "aria-disabled": true as const,
      "aria-describedby": tip.id,
      "data-reason": "",
      ...tip.handlers,
      onClick: refuse,
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") event.preventDefault();
        tip.handlers.onKeyDown(event);
      },
    },
    node: tip.node,
  };
}
