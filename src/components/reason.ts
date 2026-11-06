import type { FocusEvent, ForwardedRef, KeyboardEvent } from "react";
import { useReason, useTip } from "./Tooltip";

/**
 * A control that cannot be used yet, and why. With a reason it is not natively disabled: it is
 * `aria-disabled`, so it stays in the tab order and under the pointer, a press or Enter on it
 * does nothing (a submit is held back too), and the library's tooltip says the reason where the
 * pointer or the focus lands on it (`useReason`). Without one it is natively disabled, as it was.
 * Spread `props` last; `node` is the tooltip, rendered beside the control.
 */
export function useBlocked<T extends HTMLElement>(disabled: boolean | undefined, reason: string | undefined, forwarded?: ForwardedRef<T>) {
  const why = useReason(disabled ? reason : undefined);
  if (!why.node) return { props: { disabled, ref: forwarded }, node: null };
  const { ref: anchor, ...rest } = why.props as { ref: (el: HTMLElement | null) => void } & Record<string, unknown>;
  // A forwarded callback ref that hands back a cleanup (React 19) keeps it, and the cleanup
  // lets go of the tooltip's anchor too, since React then calls this with null no more.
  const ref = (el: T | null) => {
    anchor(el);
    if (typeof forwarded === "function") {
      const cleanup = (forwarded as (el: T | null) => unknown)(el);
      if (typeof cleanup === "function")
        return () => {
          cleanup();
          anchor(null);
        };
    } else if (forwarded) forwarded.current = el;
    return undefined;
  };
  return { props: { ...rest, ref }, node: why.node };
}

/**
 * A field held for a reason: it takes no words, and the reason hangs from its box (`anchor`)
 * on the pointer resting there and on the field taking focus. `describedBy` is the id to join
 * to the field's own `aria-describedby`; the field calls `focus`, `blur` and `key` from its own
 * handlers, so they keep working. Held only while it is disabled, as `useBlocked` is: a reason
 * kept beside a field that is open again holds nothing. Without either every handler is quiet.
 */
export function useFieldReason(disabled: boolean | undefined, reason: string | undefined) {
  const tip = useTip(disabled ? reason : undefined);
  return {
    held: tip.has,
    describedBy: tip.has ? tip.id : undefined,
    anchor: (el: HTMLElement | null) => {
      tip.anchor.current = el;
    },
    box: tip.has ? { onPointerEnter: tip.handlers.onPointerEnter, onPointerLeave: tip.handlers.onPointerLeave } : {},
    focus: (event: FocusEvent<HTMLElement>) => tip.has && tip.handlers.onFocus(event),
    blur: () => tip.has && tip.handlers.onBlur(),
    key: (event: KeyboardEvent<HTMLElement>) => tip.has && tip.handlers.onKeyDown(event),
    node: tip.node,
  };
}
