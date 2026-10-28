import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { ArrowRightIcon, ChevronRightIcon } from "../icons/icons";
import { textOf, toOptions, type Items, type Option } from "./items";
import { Kbd } from "./Kbd";
import { SearchField } from "./SearchField";
import { Spinner } from "./Spinner";

/** An option of a palette: what `Items` carries, and the place it sits in, drawn before its words. */
export interface PaletteOption extends Option {
  crumb?: ReactNode;
}

const matches = (option: Option, query: string) => textOf(option).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());

/** Every place `term` occurs in `text`, case-insensitive, as pieces to draw marked or not. */
function marked(text: string, term: string): ReactNode {
  const needle = term.trim();
  if (needle === "") return text;
  const pattern = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu");
  const out: ReactNode[] = [];
  let from = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (at > from) out.push(text.slice(from, at));
    out.push(
      <mark key={at} className="ui-palette-mark">
        {match[0]}
      </mark>,
    );
    from = at + match[0].length;
  }
  if (out.length === 0) return text;
  if (from < text.length) out.push(text.slice(from));
  return out;
}

/**
 * A search over the page that finds something to open: a field at its head and the options
 * under it in their groups, in the top layer on the browser's own `<dialog>`, so the focus is
 * held inside it and given back on closing.
 *
 * The focus stays in the field. The arrows move through the options, round from the last to
 * the first; the first is lit whenever the options change and the pointer lights the one under
 * it, which stays lit when the pointer leaves. Enter opens the lit one, and with Cmd or Ctrl it
 * opens it in a new tab, as a press with either does; Escape and a press on the veil close it.
 *
 * `query` and `onQueryChange` hold what is typed. `items` are `Items` (a `PaletteOption` adds
 * the place it sits in, drawn before its words with a chevron), grouped by `group` in the order
 * groups first appear; `filter={false}` takes them as the server narrowed them, and the words
 * matching `highlight` (what is typed, unless given) are marked in each label. `loading` draws a
 * spinner in place of the list and `empty` is said when nothing is there. The list keeps one
 * height from opening, so an answer arriving moves nothing. `foot` replaces the keys at the
 * foot, which a screen with no keyboard of its own does not show; `false` leaves it off.
 * `onEmptyBackspace` is Backspace with nothing typed, the way back out of a list inside it.
 */
export function CommandPalette(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  items: Items | ReadonlyArray<PaletteOption>;
  onSelect: (value: string, how: { newTab: boolean }) => void;
  filter?: false | ((option: Option, query: string) => boolean);
  highlight?: string;
  loading?: boolean;
  empty?: ReactNode;
  /** What the field is called to a screen reader; "Search" unless given. */
  label?: string;
  placeholder?: string;
  foot?: ReactNode | false;
  /** Backspace in an empty field: a palette inside one of its own lists goes back out of it. */
  onEmptyBackspace?: () => void;
  className?: string;
}) {
  const id = useId();
  const list = `${id}-list`;
  const box = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const pressed = useRef(false);

  const options = toOptions(props.items as Items) as PaletteOption[];
  const test = props.filter === false ? null : (props.filter ?? matches);
  const kept = test && props.query.trim() !== "" ? options.filter((one) => test(one, props.query)) : options;
  const order: Array<string | undefined> = [];
  for (const one of kept) if (!order.includes(one.group)) order.push(one.group);
  const visible = props.loading ? [] : order.flatMap((group) => kept.filter((one) => one.group === group));

  // An option is lit only while the pointer is on it or the arrows chose it, and belongs to the
  // options it was lit in; with none lit, Enter still opens the first.
  const shape = visible.map((one) => one.value).join("\n");
  const [lit, setLit] = useState<{ shape: string; at: number; by: "pointer" | "keys" }>({ shape: "", at: -1, by: "keys" });
  const firstAt = visible.findIndex((one) => !one.disabled);
  const active = lit.shape === shape && lit.at >= 0 && lit.at < visible.length ? lit.at : -1;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    if (props.open && !el.open) {
      el.showModal();
      field.current?.focus();
    }
    if (!props.open && el.open) el.close();
  }, [props.open]);

  // Closed while still up when it leaves the page, so the top layer lets go of it.
  useLayoutEffect(() => {
    const el = box.current;
    return () => {
      if (el?.open) el.close();
    };
  }, []);

  // The lit option is kept in view as the arrows move through a long list.
  useEffect(() => {
    if (props.open && active >= 0) document.getElementById(`${list}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [props.open, active, list]);

  const step = (by: 1 | -1) => {
    const count = visible.length;
    for (let moved = 1; moved <= count; moved++) {
      const at = (((active < 0 ? (by > 0 ? -1 : 0) : active) + by * moved) % count + count) % count;
      if (!visible[at]!.disabled) return at;
    }
    return active;
  };

  const choose = (option: PaletteOption | undefined, newTab: boolean) => {
    if (!option || option.disabled) return;
    props.onSelect(option.value, { newTab });
  };

  const keyed = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (visible.length > 0) setLit({ shape, at: step(event.key === "ArrowDown" ? 1 : -1), by: "keys" });
        return;
      case "Enter": {
        const at = active >= 0 ? active : firstAt;
        if (at < 0) return;
        event.preventDefault();
        choose(visible[at], event.metaKey || event.ctrlKey);
        return;
      }
      case "Backspace":
        if (props.query === "" && props.onEmptyBackspace) {
          event.preventDefault();
          props.onEmptyBackspace();
        }
        return;
      case "Escape":
        // Closed outright, as the palette this replaces closed, rather than emptied first.
        event.preventDefault();
        props.onOpenChange(false);
        return;
    }
  };

  const term = props.highlight ?? props.query;
  const groupOf = (at: number) => visible[at]!.group;
  const foot =
    props.foot === false ? null : (
      <div className={props.foot === undefined ? "ui-palette-foot ui-palette-keys" : "ui-palette-foot"}>
        {props.foot ?? (
          <>
            <span>
              <Kbd name="Up">↑</Kbd>
              <Kbd name="Down">↓</Kbd> Move
            </span>
            <span>
              <Kbd name="Enter">↵</Kbd> Open
            </span>
            <span>
              <Kbd>Esc</Kbd> Close
            </span>
          </>
        )}
      </div>
    );

  return (
    <dialog
      ref={box}
      className={props.className ? `ui-dialog ui-palette ${props.className}` : "ui-dialog ui-palette"}
      aria-label={props.label ?? "Search"}
      onCancel={(event) => {
        event.preventDefault();
        props.onOpenChange(false);
      }}
      onPointerDown={(event) => {
        pressed.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressed.current && event.target === event.currentTarget) props.onOpenChange(false);
        pressed.current = false;
      }}
    >
      {props.open ? (
        <div className="ui-dialog-frame">
          <div className="ui-palette-head">
            <SearchField
              ref={field}
              value={props.query}
              onValueChange={props.onQueryChange}
              aria-label={props.label ?? "Search"}
              placeholder={props.placeholder ?? props.label ?? "Search"}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-expanded={true}
              aria-controls={list}
              aria-activedescendant={active >= 0 ? `${list}-${active}` : undefined}
              onKeyDown={keyed}
            />
          </div>
          <div
            id={list}
            role="listbox"
            className="ui-palette-list"
            aria-label={props.label ?? "Search"}
            aria-busy={props.loading ? true : undefined}
            // Nothing in the list takes the focus from the field.
            onPointerDown={(event) => event.preventDefault()}
          >
            {props.loading ? (
              <div className="ui-palette-state">
                <Spinner size={20} label="Looking" />
              </div>
            ) : visible.length === 0 ? (
              props.empty !== undefined ? (
                <p className="ui-palette-state" role="status">
                  {props.empty}
                </p>
              ) : null
            ) : (
              visible.map((option, at) => {
                const heads = option.group !== undefined && (at === 0 || groupOf(at - 1) !== option.group);
                return (
                  <Fragment key={option.value}>
                    {heads ? (
                      <div className="ui-menu-group" role="presentation">
                        {option.group}
                      </div>
                    ) : null}
                    <div
                      id={`${list}-${at}`}
                      role="option"
                      className="ui-menu-item ui-palette-item"
                      aria-selected={at === active}
                      aria-disabled={option.disabled ? true : undefined}
                      data-active={at === active ? "" : undefined}
                      onPointerMove={() => (option.disabled || at === active ? undefined : setLit({ shape, at, by: "pointer" }))}
                      onPointerLeave={() => setLit((was) => (was.by === "pointer" && was.at === at ? { shape, at: -1, by: "pointer" } : was))}
                      onClick={(event: MouseEvent) => choose(option, event.metaKey || event.ctrlKey)}
                    >
                      {option.start ? <span className="ui-start">{option.start}</span> : null}
                      <span className="ui-palette-line">
                        {option.crumb ? (
                          <>
                            <span className="ui-palette-crumb">{option.crumb}</span>
                            <ChevronRightIcon size={12} className="ui-palette-chevron" aria-hidden="true" />
                          </>
                        ) : null}
                        <span className="ui-palette-title">{typeof option.label === "string" ? marked(option.label, term) : option.label}</span>
                        {option.hint ? <span className="ui-palette-hint">{option.hint}</span> : null}
                      </span>
                      <ArrowRightIcon size={14} className="ui-palette-go" aria-hidden="true" />
                    </div>
                  </Fragment>
                );
              })
            )}
          </div>
          {foot}
        </div>
      ) : null}
    </dialog>
  );
}
