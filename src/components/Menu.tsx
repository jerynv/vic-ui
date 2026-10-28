import type { Placement } from "@floating-ui/dom";
import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from "react";
import { atPoint, useAnchored, usePressAway } from "./Popover";
import { useTip } from "./Tooltip";

/** An action in a menu. `text` is what type-ahead matches when `label` is not a string. */
export interface MenuAction {
  label: ReactNode;
  text?: string;
  icon?: ReactNode;
  /** A line under the words, quieter. */
  hint?: ReactNode;
  /** A quiet word at the row's end, as "Done". */
  end?: ReactNode;
  onSelect: () => void;
  /** It removes, ends or destroys: drawn in the danger ink. */
  danger?: boolean;
  disabled?: boolean;
  /** Why it cannot be chosen: it stays reachable by the keys and shows this beside it. */
  disabledReason?: string | undefined;
}

/** A row holding a control of its own at its end (a switcher): the keys reach it as they reach an action, and the focus goes into the control. */
export interface MenuControl {
  label: ReactNode;
  text?: string;
  icon?: ReactNode;
  control: ReactNode;
}

/** A menu's rows: actions, rows holding a control, a rule between them, a heading that starts a group, and what stands over them all (`head`), which the keys pass over. */
export type MenuItem = MenuAction | MenuControl | { separator: true } | { group: ReactNode } | { head: ReactNode };

type MenuRow = MenuAction | MenuControl;

/** What a menu's trigger is given to spread on itself. */
export interface MenuTriggerProps {
  ref: (el: HTMLElement | null) => void;
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
  "aria-controls": string;
  onClick: (event: { detail: number }) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

type Opened = { trigger: (props: MenuTriggerProps) => ReactElement; at?: never; open?: boolean; onOpenChange?: (open: boolean) => void };
type AtPoint = { at: { x: number; y: number }; open: boolean; onOpenChange: (open: boolean) => void; trigger?: never };

const isRow = (item: MenuItem): item is MenuRow => "onSelect" in item || "control" in item;
const isControl = (item: MenuRow): item is MenuControl => "control" in item;
const wordsOf = (item: MenuRow) => (item.text ?? (typeof item.label === "string" ? item.label : "")).toLowerCase();

/**
 * A list of actions opened from a trigger, or at a point (`at`, for the right button), on the
 * floating surface every list sits on, in the top layer. It is worked as a menu is: the arrows
 * move and wrap, Home and End go to the ends, Enter or Space chooses, a letter jumps to the
 * next action starting with it, and Escape or a choice closes it and puts the focus back where
 * it was. An action that cannot be chosen is passed over by the keys unless it says why.
 */
export function Menu(props: { items: MenuItem[]; "aria-label"?: string; placement?: Placement; className?: string } & (Opened | AtPoint)) {
  const id = useId();
  const [own, setOwn] = useState(false);
  const open = props.open ?? own;
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setOwn(next);
    props.onOpenChange?.(next);
  };
  const [active, setActive] = useState(-1);
  const trigger = useRef<HTMLElement | null>(null);
  const menu = useRef<HTMLDivElement>(null);
  const rows = useRef<Array<HTMLDivElement | null>>([]);
  const before = useRef<HTMLElement | null>(null);
  const typed = useRef({ text: "", at: 0 });

  const actions = props.items.filter(isRow);
  const reachable = (at: number) => {
    const one = actions[at];
    return !!one && (isControl(one) || !one.disabled || !!one.disabledReason);
  };
  const step = (from: number, by: 1 | -1) => {
    for (let n = 1; n <= actions.length; n++) {
      const at = (((from + by * n) % actions.length) + actions.length) % actions.length;
      if (reachable(at)) return at;
    }
    return -1;
  };
  const first = () => step(-1, 1);
  const last = () => step(actions.length, -1);

  const anchor = () => (props.at ? atPoint(props.at.x, props.at.y) : trigger.current);
  useAnchored(open, anchor, menu, { placement: props.placement ?? "bottom-start", track: props.at ? `${props.at.x},${props.at.y}` : undefined });

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) (props.trigger ? trigger.current : before.current)?.focus();
  };
  usePressAway(open, () => [trigger.current, menu.current], () => close(false));

  // Where the focus was is kept before the menu takes it, to give it back on closing.
  useLayoutEffect(() => {
    if (open) before.current = document.activeElement as HTMLElement | null;
    else setActive(-1);
  }, [open]);

  // The focus follows the active action, into a row's control, or rests on the menu while none is.
  useEffect(() => {
    if (!open) return;
    const row = active >= 0 ? rows.current[active] : null;
    const held = row?.hasAttribute("data-control") ? row.querySelector<HTMLElement>("[aria-checked='true'], [aria-selected='true'], button, input, [tabindex]:not([tabindex='-1'])") : null;
    (held ?? row ?? menu.current)?.focus({ preventScroll: active < 0 });
  }, [open, active]);

  // An action that says why it cannot be chosen says so while it is the active one.
  const activeRow = active >= 0 ? actions[active] : undefined;
  const reasonAt = activeRow && !isControl(activeRow) ? activeRow.disabledReason : undefined;
  const tip = useTip(reasonAt, { placement: "right" });
  useEffect(() => {
    tip.hide();
    if (!open || !reasonAt) return;
    tip.anchor.current = rows.current[active] ?? null;
    tip.show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, reasonAt]);

  const pick = (at: number) => {
    const one = actions[at];
    if (!one || isControl(one) || one.disabled || one.disabledReason) return;
    close(true);
    one.onSelect();
  };

  const jump = (key: string) => {
    const now = performance.now();
    typed.current = { text: now - typed.current.at < 700 ? typed.current.text + key.toLowerCase() : key.toLowerCase(), at: now };
    for (let n = 1; n <= actions.length; n++) {
      const at = (active + n + actions.length) % actions.length;
      if (reachable(at) && wordsOf(actions[at]!).startsWith(typed.current.text)) return setActive(at);
    }
  };

  const keyed = (event: KeyboardEvent<HTMLDivElement>) => {
    // Inside a row's control its own keys work it: only the arrows up and down, Escape and Tab leave it.
    const inControl = activeRow !== undefined && isControl(activeRow) && event.target !== rows.current[active];
    if (inControl && !["ArrowDown", "ArrowUp", "Escape", "Tab"].includes(event.key)) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        return setActive(step(active, 1));
      case "ArrowUp":
        event.preventDefault();
        return setActive(active < 0 ? last() : step(active, -1));
      case "Home":
        event.preventDefault();
        return setActive(first());
      case "End":
        event.preventDefault();
        return setActive(last());
      case "Enter":
      case " ":
        event.preventDefault();
        if (active >= 0) pick(active);
        return;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        return close(true);
      case "Tab":
        return close(false);
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) jump(event.key);
    }
  };

  const openWith = (at: () => number) => {
    setOpen(true);
    setActive(at());
  };

  // The rows in sections, each group heading starting one, so a group is labelled by its heading.
  const sections: Array<{ heading?: ReactNode; rows: Array<{ action: MenuRow; at: number } | "rule"> }> = [{ rows: [] }];
  const heads: ReactNode[] = [];
  let count = 0;
  for (const item of props.items) {
    if ("head" in item) heads.push(item.head);
    else if ("group" in item) sections.push({ heading: item.group, rows: [] });
    else if ("separator" in item) sections[sections.length - 1]!.rows.push("rule");
    else sections[sections.length - 1]!.rows.push({ action: item, at: count++ });
  }

  const controlRow = (action: MenuControl, at: number) => (
    <div
      key={at}
      ref={(el) => {
        rows.current[at] = el;
      }}
      role="none"
      className="ui-menu-item"
      data-control=""
      data-active={at === active ? "" : undefined}
      onPointerMove={() => {
        if (at !== active) setActive(at);
      }}
    >
      {action.icon ? (
        <span className="ui-menu-icon" aria-hidden="true">
          {action.icon}
        </span>
      ) : null}
      <span className="ui-menu-words">{action.label}</span>
      <span className="ui-menu-control">{action.control}</span>
    </div>
  );

  const row = ({ action, at }: { action: MenuRow; at: number }) =>
    isControl(action) ? controlRow(action, at) : (
    <div
      key={at}
      ref={(el) => {
        rows.current[at] = el;
      }}
      id={`${id}-${at}`}
      role="menuitem"
      tabIndex={-1}
      className="ui-menu-item"
      aria-disabled={action.disabled || action.disabledReason ? true : undefined}
      aria-describedby={action.disabledReason && at === active && tip.has ? tip.id : undefined}
      data-active={at === active ? "" : undefined}
      data-danger={action.danger ? "" : undefined}
      data-reason={action.disabledReason ? "" : undefined}
      onPointerMove={() => {
        if (at !== active) setActive(reachable(at) ? at : -1);
      }}
      onClick={() => pick(at)}
    >
      {action.icon ? (
        <span className="ui-menu-icon" aria-hidden="true">
          {action.icon}
        </span>
      ) : null}
      <span className="ui-menu-words">
        {action.label}
        {action.hint ? <small className="ui-menu-hint">{action.hint}</small> : null}
      </span>
      {action.end ? <span className="ui-menu-end">{action.end}</span> : null}
    </div>
  );

  return (
    <>
      {props.trigger
        ? props.trigger({
            ref: (el) => {
              trigger.current = el;
            },
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-controls": id,
            // A click the keys made (Enter or Space) opens on the first action; a press opens on none.
            onClick: (event) => (open ? close(false) : event.detail === 0 ? openWith(first) : setOpen(true)),
            onKeyDown: (event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
              event.preventDefault();
              openWith(event.key === "ArrowDown" ? first : last);
            },
          })
        : null}
      {open ? (
        <div
          ref={menu}
          id={id}
          role="menu"
          popover="manual"
          tabIndex={-1}
          aria-label={props["aria-label"]}
          className={["ui-menu ui-menu-actions", props.className ?? ""].filter(Boolean).join(" ")}
          onKeyDown={keyed}
          onContextMenu={(event) => event.preventDefault()}
        >
          {heads.map((head, h) => (
            <div key={`head-${h}`} className="ui-menu-head">
              {head}
            </div>
          ))}
          {sections.map((section, s) => {
            const body = section.rows.map((one, r) => (one === "rule" ? <div key={`rule-${r}`} role="separator" className="ui-menu-rule" /> : row(one)));
            if (section.heading === undefined) return <Fragment key={s}>{body}</Fragment>;
            return (
              <div key={s} role="group" aria-labelledby={`${id}-group-${s}`} className="ui-menu-section">
                <div id={`${id}-group-${s}`} className="ui-menu-label">
                  {section.heading}
                </div>
                {body}
              </div>
            );
          })}
          {tip.node}
        </div>
      ) : null}
    </>
  );
}
