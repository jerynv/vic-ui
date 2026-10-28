import { createContext, useContext, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDownIcon } from "../icons/icons";
import { useBlocked } from "./reason";

/**
 * Sections that open under their heads. `value` is the list of the open items' values and
 * `onValueChange` is handed the next one, so a caller holds it as it holds any choice;
 * without `value` the accordion holds it itself from `defaultValue`. `multiple` lets several
 * stand open; otherwise opening one closes the rest. Each head is a button with
 * `aria-expanded`, its panel a region named by it; the arrow keys, Home and End move between
 * heads. A panel eases its height open and shut, and does not move under reduced motion.
 */
type Shared = { open: string[]; toggle: (value: string) => void; level: 2 | 3 | 4 | 5 | 6 };
const Context = createContext<Shared | null>(null);

export function Accordion(props: { value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void; multiple?: boolean; level?: 2 | 3 | 4 | 5 | 6; className?: string; children: ReactNode }) {
  const [held, setHeld] = useState<string[]>(props.defaultValue ?? []);
  const open = props.value ?? held;
  const toggle = (value: string) => {
    const next = open.includes(value) ? open.filter((each) => each !== value) : props.multiple ? [...open, value] : [value];
    if (props.value === undefined) setHeld(next);
    props.onValueChange?.(next);
  };
  return (
    <Context.Provider value={{ open, toggle, level: props.level ?? 3 }}>
      <div className={props.className ? `ui-accordion ${props.className}` : "ui-accordion"} onKeyDown={moveBetweenHeads}>
        {props.children}
      </div>
    </Context.Provider>
  );
}

function moveBetweenHeads(event: KeyboardEvent<HTMLDivElement>) {
  const target = event.target as HTMLElement;
  if (!target.classList.contains("ui-accordion-trigger")) return;
  const heads = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(":scope > .ui-accordion-item > .ui-accordion-head > .ui-accordion-trigger:not(:disabled)"));
  const at = heads.indexOf(target as HTMLButtonElement);
  if (at < 0) return;
  const to = event.key === "ArrowDown" ? (at + 1) % heads.length : event.key === "ArrowUp" ? (at - 1 + heads.length) % heads.length : event.key === "Home" ? 0 : event.key === "End" ? heads.length - 1 : -1;
  if (to < 0) return;
  event.preventDefault();
  heads[to]?.focus();
}

/**
 * One section: `title` is its head, the children its panel. `disabledReason` keeps a head that
 * cannot open focusable and says why; `disabled` alone shuts it natively.
 */
export function AccordionItem(props: { value: string; title: ReactNode; disabled?: boolean; disabledReason?: string | undefined; className?: string; children: ReactNode }) {
  const shared = useContext(Context);
  if (!shared) throw new Error("AccordionItem is drawn inside an Accordion");
  const id = useId();
  const isOpen = shared.open.includes(props.value);
  const held = useBlocked<HTMLButtonElement>(props.disabled || Boolean(props.disabledReason), props.disabledReason);
  const Heading = `h${shared.level}` as const;
  return (
    <div className={props.className ? `ui-accordion-item ${props.className}` : "ui-accordion-item"} data-open={isOpen || undefined}>
      <Heading className="ui-accordion-head">
        <button
          type="button"
          id={`${id}-head`}
          className="ui-accordion-trigger"
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={() => {
            if (!props.disabled && !props.disabledReason) shared.toggle(props.value);
          }}
          {...held.props}
        >
          <span className="ui-accordion-title">{props.title}</span>
          <ChevronDownIcon size={15} className="ui-accordion-chevron" aria-hidden="true" />
        </button>
        {held.node}
      </Heading>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-head`} className="ui-accordion-panel" inert={!isOpen}>
        <div className="ui-accordion-clip">
          <div className="ui-accordion-content">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
