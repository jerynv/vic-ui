import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ChevronRightIcon } from "../icons/icons";
import { treePathTo, type TreeItem } from "./treePath";

export { treePathTo, type TreeItem };

interface Shown {
  item: TreeItem;
  level: number;
  parent: string | null;
  open: boolean;
  branch: boolean;
}

const textOf = (item: TreeItem) => (item.text ?? (typeof item.label === "string" ? item.label : "")).toLowerCase();

/**
 * A tree of places to go, as a file manager's side column draws its folders: each branch opens
 * and closes on its chevron, the one where the reader is (`value`) is filled, and pressing a row
 * goes there (`onValueChange`) and opens it. When `value` changes, it and every branch holding it
 * open, so the reader always sees where they are and what is inside it; the rest stay as the
 * reader left them.
 *
 * Worked as the WAI-ARIA Authoring Practices' file directory tree is (w3.org/WAI/ARIA/apg/patterns/treeview):
 * one row in the tab order, Up and Down move through the rows shown, Right opens a branch or
 * steps into it, Left closes it or steps out to its parent, Home and End go to the ends, Enter
 * or Space chooses, and a letter jumps to the next row starting with it.
 */
export function Tree(props: { items: readonly TreeItem[]; value: string | null; onValueChange: (id: string) => void; "aria-label": string; className?: string }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(props.value ? [...treePathTo(props.items, props.value), props.value] : []));
  const [focus, setFocus] = useState<string | null>(props.value);
  const rows = useRef(new Map<string, HTMLDivElement>());
  const typed = useRef({ text: "", at: 0 });

  // Where the reader is, opened to and opened: a new `value`, or a branch above it arriving, opens
  // every branch above it and itself, so what is inside where the reader is shows under it.
  const above = props.value ? [...treePathTo(props.items, props.value), props.value] : [];
  const aboveKey = JSON.stringify(above);
  useEffect(() => {
    const ids: string[] = JSON.parse(aboveKey);
    setOpen((now) => (ids.every((id) => now.has(id)) ? now : new Set([...now, ...ids])));
  }, [aboveKey]);
  // A new `value` moves the roving stop to it in the same draw, never a frame later.
  const [seenValue, setSeenValue] = useState(props.value);
  if (seenValue !== props.value) {
    setSeenValue(props.value);
    setFocus(props.value);
  }

  const shown: Shown[] = [];
  const lay = (list: readonly TreeItem[], level: number, parent: string | null) => {
    for (const item of list) {
      const branch = (item.children?.length ?? 0) > 0;
      const isOpen = branch && open.has(item.id);
      shown.push({ item, level, parent, open: isOpen, branch });
      if (isOpen) lay(item.children!, level + 1, item.id);
    }
  };
  lay(props.items, 1, null);

  const toggle = (id: string, to?: boolean) =>
    setOpen((now) => {
      const next = new Set(now);
      if (to ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });
  const moveTo = (id: string | undefined) => {
    if (!id) return;
    setFocus(id);
    rows.current.get(id)?.focus();
  };
  const choose = (row: Shown) => {
    if (row.branch) toggle(row.item.id, true);
    props.onValueChange(row.item.id);
  };

  // The one row in the tab order: where focus was, else where the reader is, else the first.
  const tabbed = shown.some((row) => row.item.id === focus) ? focus : shown.some((row) => row.item.id === props.value) ? props.value : (shown[0]?.item.id ?? null);

  const keyed = (event: KeyboardEvent<HTMLDivElement>, at: number) => {
    const row = shown[at]!;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveTo(shown[at + 1]?.item.id);
        return;
      case "ArrowUp":
        event.preventDefault();
        moveTo(shown[at - 1]?.item.id);
        return;
      case "ArrowRight":
        event.preventDefault();
        if (row.branch && !row.open) toggle(row.item.id, true);
        else if (row.open) moveTo(shown[at + 1]?.item.id);
        return;
      case "ArrowLeft":
        event.preventDefault();
        if (row.open) toggle(row.item.id, false);
        else moveTo(row.parent ?? undefined);
        return;
      case "Home":
        event.preventDefault();
        moveTo(shown[0]?.item.id);
        return;
      case "End":
        event.preventDefault();
        moveTo(shown[shown.length - 1]?.item.id);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(row);
        return;
      default:
        if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
        {
          const now = performance.now();
          typed.current = { text: now - typed.current.at < 700 ? typed.current.text + event.key.toLowerCase() : event.key.toLowerCase(), at: now };
          const order = shown.map((_, i) => shown[(i + at + 1) % shown.length]!);
          moveTo(order.find((one) => textOf(one.item).startsWith(typed.current.text))?.item.id);
        }
    }
  };

  return (
    <div role="tree" aria-label={props["aria-label"]} className={props.className ? `ui-tree ${props.className}` : "ui-tree"}>
      {shown.map((row, at) => (
        <div
          key={row.item.id}
          ref={(el) => {
            if (el) rows.current.set(row.item.id, el);
            else rows.current.delete(row.item.id);
          }}
          role="treeitem"
          className="ui-tree-row"
          aria-level={row.level}
          aria-expanded={row.branch ? row.open : undefined}
          aria-selected={row.item.id === props.value}
          aria-current={row.item.id === props.value ? "page" : undefined}
          tabIndex={row.item.id === tabbed ? 0 : -1}
          style={{ "--tree-level": row.level - 1 } as CSSProperties}
          onClick={() => {
            setFocus(row.item.id);
            choose(row);
          }}
          onKeyDown={(event) => keyed(event, at)}
        >
          {row.branch ? (
            <span
              className="ui-tree-chevron"
              data-open={row.open ? "" : undefined}
              aria-hidden="true"
              onClick={(event) => {
                event.stopPropagation();
                toggle(row.item.id);
              }}
            >
              <ChevronRightIcon size={14} />
            </span>
          ) : (
            <span className="ui-tree-chevron" aria-hidden="true" />
          )}
          {row.item.icon ? <span className="ui-tree-icon">{row.item.icon}</span> : null}
          <span className="ui-tree-words">{row.item.label}</span>
          {row.item.end ? <span className="ui-tree-end">{row.item.end}</span> : null}
        </div>
      ))}
    </div>
  );
}
