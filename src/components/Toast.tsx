import { useEffect, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { CheckCircleIcon, ClockIcon, FlagIcon, XIcon } from "../icons/icons";

/**
 * A word that something happened, drawn at the foot of the window for a few seconds. `toast()`
 * puts one up from anywhere, and the one `<Toaster/>` the frame mounts draws them. Plain, a
 * toast is the ink surface; a `tone` draws it as a notice in that tone, its words still saying
 * what happened. It goes by itself after `duration` (5 seconds; 0 keeps it until dismissed),
 * and waits while the pointer is on it or the focus is in it. An `action` is one press, which
 * also dismisses it.
 */
export type ToastTone = "danger" | "caution" | "settled" | "moving";

export interface ToastOptions {
  description?: ReactNode;
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; onPress: () => void };
  /** Putting one up again under the same id replaces it rather than stacking a second. */
  id?: string;
}

interface Shown extends ToastOptions {
  id: string;
  message: ReactNode;
  leaving: boolean;
  stamp: number;
}

const MOST = 4;
const LEAVE_MS = 160;
let shown: Shown[] = [];
let made = 0;
const listeners = new Set<() => void>();

function set(next: Shown[]) {
  shown = next;
  for (const listen of listeners) listen();
}

export function toast(message: ReactNode, options: ToastOptions = {}): string {
  const id = options.id ?? `toast-${made + 1}`;
  const one: Shown = { ...options, id, message, leaving: false, stamp: ++made };
  const kept = shown.filter((other) => other.id !== id);
  set([...kept, one].slice(-MOST));
  return id;
}

toast.dismiss = (id: string) => {
  if (!shown.some((one) => one.id === id && !one.leaving)) return;
  set(shown.map((one) => (one.id === id ? { ...one, leaving: true } : one)));
  setTimeout(() => set(shown.filter((one) => one.id !== id || !one.leaving)), LEAVE_MS);
};

const subscribe = (listen: () => void) => {
  listeners.add(listen);
  return () => listeners.delete(listen);
};

const ICONS = { danger: FlagIcon, caution: FlagIcon, settled: CheckCircleIcon, moving: ClockIcon } as const;

function Toast(props: { one: Shown }) {
  const { one } = props;
  const duration = one.duration ?? 5000;
  const left = useRef(duration);
  const since = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const run = () => {
    if (duration <= 0 || timer.current) return;
    since.current = performance.now();
    timer.current = setTimeout(() => toast.dismiss(one.id), left.current);
  };
  const hold = () => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = undefined;
    left.current = Math.max(1000, left.current - (performance.now() - since.current));
  };

  useEffect(() => {
    left.current = duration;
    run();
    return hold;
    // A toast put up again under its id starts its time again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one.stamp, duration]);

  const Icon = one.tone ? ICONS[one.tone] : null;
  return (
    <div
      role="status"
      className="ui-toast"
      data-tone={one.tone}
      data-leaving={one.leaving ? "" : undefined}
      onPointerEnter={hold}
      onPointerLeave={run}
      onFocus={hold}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) run();
      }}
    >
      {Icon ? <Icon size={16} className="ui-toast-icon" aria-hidden="true" /> : null}
      <div className="ui-toast-words">
        <p className="ui-toast-message">{one.message}</p>
        {one.description ? <p className="ui-toast-description">{one.description}</p> : null}
      </div>
      {one.action ? (
        <button
          type="button"
          className="ui-toast-action"
          onClick={() => {
            one.action!.onPress();
            toast.dismiss(one.id);
          }}
        >
          {one.action.label}
        </button>
      ) : null}
      <button type="button" className="ui-toast-close" aria-label="Dismiss" title="Dismiss" onClick={() => toast.dismiss(one.id)}>
        <XIcon size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Where toasts are drawn: mounted once, in the top layer (`popover`) so a dialog does not
 * cover them, and raised again over anything opened since whenever a new one arrives.
 */
export function Toaster() {
  const list = useSyncExternalStore(subscribe, () => shown, () => shown);
  const stack = useRef<HTMLDivElement>(null);
  const newest = list.at(-1)?.id;

  useLayoutEffect(() => {
    const node = stack.current;
    if (!node || !("showPopover" in node)) return;
    if (node.matches(":popover-open")) node.hidePopover();
    if (list.length > 0) node.showPopover();
  }, [newest, list.length === 0]);

  return (
    <div ref={stack} popover="manual" className="ui-toaster" aria-label="Notifications" role="region">
      {list.map((one) => (
        <Toast key={one.id} one={one} />
      ))}
    </div>
  );
}
