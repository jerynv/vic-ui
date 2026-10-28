import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CheckIcon, XIcon } from "../icons/icons";
import { textOf, toOptions, type Items, type Option } from "./items";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useFieldReason } from "./reason";

interface Shared {
  label?: ReactNode;
  "aria-label"?: string;
  items: Items;
  /** What the field says while nothing is typed; open, a single field says its choice instead. */
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Said in the list when nothing matches; without it a list with nothing in it stays shut. */
  empty?: ReactNode;
  /** Said at the foot of the open list, such as that a search found more than it shows. */
  footer?: ReactNode;
  /** What is typed, held by the page (a search the server answers); otherwise the field keeps it. */
  query?: string;
  onQueryChange?: (query: string) => void;
  /** How an option matches what is typed; `false` filters nothing, for a list the server has already narrowed. */
  filter?: false | ((option: Option, query: string) => boolean);
  /**
   * The chosen options as the field and its chips draw them when `items` does not carry them,
   * such as a search the server answers only while the list is open.
   */
  chosenItems?: Items;
  /**
   * The open list keeps one height from the moment it opens, on the side with more room, so an
   * answer arriving from the server never resizes it or moves it to the other side.
   */
  steady?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  disabledReason?: string | undefined;
  name?: string;
  id?: string;
  size?: "sm";
  className?: string;
}

interface One extends Shared {
  value: string | null;
  onValueChange?: (value: string) => void;
  values?: undefined;
}

interface Many extends Shared {
  values: string[];
  onValuesChange?: (values: string[]) => void;
  /** A chosen value as its chip, less its x; the option's label when not given. */
  chip?: (value: string, option: Option | undefined) => ReactNode;
  /** What the x on a chip says to a screen reader. */
  chipLabel?: (value: string, option: Option | undefined) => string;
  value?: undefined;
}

export type ComboboxProps = One | Many;

/** The open list's tallest and shortest, in pixels. */
const LIST_MOST = 320;
const LIST_LEAST = 120;

const matches = (option: Option, query: string) => textOf(option).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());

/**
 * A field typed into to find a choice in a list: the box `TextField` draws, the list on the
 * menus' floating surface in the top layer, as `Select` opens it. Focus never leaves the field:
 * the arrows move through what matches, Enter chooses, Escape closes and keeps the choice, and
 * Tab moves on. Options with a `group` are drawn under it, groups in the order they first
 * appear.
 *
 * One choice is `value` and `onValueChange`; the closed field reads the choice, and emptying
 * what was typed never unchooses it. Several are `values` and `onValuesChange`, each chosen one
 * a chip in the box before the words with an x to take it off; choosing keeps the list open
 * for the next, choosing a chosen one takes it off, and Backspace in an empty field takes off
 * the last. `query`, `filter={false}` and `footer` hand the search to the server, `chosenItems`
 * draws a choice its answer no longer carries, and `steady` holds the list still as it answers.
 */
export function Combobox(props: ComboboxProps) {
  const made = useId();
  const field = props.id ?? made;
  const list = `${field}-list`;
  const many = props.values !== undefined;
  const why = useFieldReason(props.disabled, props.disabledReason);
  const steady = Boolean(props.steady);
  const held = why.held;
  const off = Boolean(props.disabled) || held;
  const said = describedBy(field, props.error, props.hint, why.describedBy);

  const options = toOptions(props.items);
  const known = props.chosenItems ? toOptions(props.chosenItems) : [];
  const chosen = many ? props.values : props.value === null ? [] : [props.value];
  const optionOf = (value: string) => options.find((one) => one.value === value) ?? known.find((one) => one.value === value);
  const [own, setOwn] = useState("");
  const query = props.query ?? own;
  const [open, setOpen] = useState(false);
  const [pointed, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const pop = useRef<HTMLDivElement>(null);

  // What matches, in group order: the list draws it and the arrows walk it in the same order.
  const visibleFor = (typed: string) => {
    const test = props.filter === false ? null : (props.filter ?? matches);
    const kept = test && typed.trim() !== "" ? options.filter((one) => test(one, typed)) : options;
    const order: Array<string | undefined> = [];
    for (const one of kept) if (!order.includes(one.group)) order.push(one.group);
    return order.flatMap((group) => kept.filter((one) => one.group === group));
  };
  const visible = visibleFor(query);
  const firstOf = (shown: Option[]) => {
    const at = shown.findIndex((one) => !many && one.value === props.value && !one.disabled);
    return at >= 0 ? at : shown.findIndex((one) => !one.disabled);
  };
  // A list the server answered again may be shorter than the active row, or have arrived after opening.
  const active = pointed >= 0 && pointed < visible.length ? pointed : firstOf(visible);
  const shows = visible.length > 0 || props.empty !== undefined || props.footer !== undefined;

  const type = (next: string) => {
    if (props.query === undefined) setOwn(next);
    props.onQueryChange?.(next);
  };
  const show = () => {
    if (off || open) return;
    setActive(firstOf(visible));
    setOpen(true);
    props.onOpenChange?.(true);
  };
  const close = () => {
    if (!open) return;
    setOpen(false);
    if (query !== "") type("");
    props.onOpenChange?.(false);
  };
  const choose = (option: Option | undefined) => {
    if (!option || option.disabled || off) return;
    if (props.values !== undefined) {
      const next = props.values.includes(option.value) ? props.values.filter((one) => one !== option.value) : [...props.values, option.value];
      props.onValuesChange?.(next);
      if (query !== "") {
        type("");
        setActive(firstOf(visibleFor("")));
      }
      return;
    }
    if (option.value !== props.value) props.onValueChange?.(option.value);
    close();
  };
  const drop = (value: string) => {
    if (props.values === undefined || off) return;
    props.onValuesChange?.(props.values.filter((one) => one !== value));
  };

  // Into the top layer and onto the box, kept there while the page scrolls or resizes.
  useLayoutEffect(() => {
    const anchor = box.current;
    const floating = pop.current;
    if (!open || !shows || !anchor || !floating) return;
    floating.showPopover();
    // Measured at its tallest before the side is chosen, so the side chosen has room for it.
    if (steady) floating.style.height = `${LIST_MOST}px`;
    const place = () =>
      void computePosition(anchor, floating, {
        strategy: "fixed",
        placement: "bottom-start",
        middleware: [
          offset(6),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
          size({
            padding: 8,
            apply({ rects, availableHeight }) {
              floating.style.minWidth = `${rects.reference.width}px`;
              const most = `${Math.min(LIST_MOST, Math.max(LIST_LEAST, availableHeight))}px`;
              floating.style.maxHeight = most;
              if (steady) floating.style.height = most;
            },
          }),
        ],
      }).then(({ x, y, placement }) => {
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
        floating.dataset.side = placement.split("-")[0];
      });
    const stop = autoUpdate(anchor, floating, place);
    return () => {
      stop();
      if (floating.matches(":popover-open")) floating.hidePopover();
    };
  }, [open, shows, steady]);

  // The active option is kept in view as the arrows move through a long list.
  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${list}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, list]);

  const step = (from: number, by: 1 | -1) => {
    for (let at = from + by; at >= 0 && at < visible.length; at += by) if (!visible[at]!.disabled) return at;
    return from;
  };

  const keyed = (event: KeyboardEvent<HTMLInputElement>) => {
    if (held) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) show();
        else setActive(step(active, 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) show();
        else setActive(step(active < 0 ? visible.length : active, -1));
        return;
      case "Enter":
        if (!open || active < 0) return;
        event.preventDefault();
        choose(visible[active]);
        return;
      case "Escape":
        if (!open || !shows) return;
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      case "Tab":
        close();
        return;
      case "Backspace":
        if (props.values !== undefined && query === "" && props.values.length > 0) drop(props.values[props.values.length - 1]!);
        return;
    }
  };

  const single = !many && props.value !== null ? optionOf(props.value) : undefined;
  const singleWords = single ? textOf(single) : !many && props.value ? props.value : "";
  // A single field reads its choice while closed and what is being typed while open.
  const shown = many || open ? query : singleWords;
  const placeholder = !many && open && singleWords ? singleWords : props.placeholder;

  const classes = ["ui-field", props.size === "sm" ? "ui-field-sm" : "", props.className ?? ""].filter(Boolean).join(" ");
  const groupOf = (at: number) => visible[at]!.group;
  return (
    <div className={classes}>
      <FieldHead field={field} label={props.label} labelId={`${field}-label`} error={props.error} />
      <div
        ref={(el) => {
          box.current = el;
          why.anchor(el);
        }}
        {...why.box}
        className="ui-field-box ui-combo-box"
        data-many={many ? "" : undefined}
        data-open={open && shows ? "" : undefined}
        data-invalid={props.error ? "" : undefined}
        data-disabled={off ? "" : undefined}
        // A press on the box past the words is a press in the field.
        onPointerDown={(event) => {
          if (event.target === input.current || off) return;
          event.preventDefault();
          input.current?.focus();
          if (open) close();
          else show();
        }}
      >
        {props.values !== undefined
          ? props.values.map((value) => {
              const option = optionOf(value);
              const words = option ? textOf(option) : value;
              return (
                <span key={value} className="ui-combo-chip">
                  {!props.chip && option?.start ? <span className="ui-start">{option.start}</span> : null}
                  <span className="ui-combo-chip-words">{props.chip ? props.chip(value, option) : (option?.label ?? value)}</span>
                  {off ? null : (
                    <button
                      type="button"
                      tabIndex={-1}
                      className="ui-combo-chip-x"
                      aria-label={props.chipLabel ? props.chipLabel(value, option) : `Take ${words} off`}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onClick={() => drop(value)}
                    >
                      <XIcon size={12} aria-hidden="true" />
                    </button>
                  )}
                </span>
              );
            })
          : null}
        {single?.start ? <span className="ui-start ui-combo-start">{single.start}</span> : null}
        <input
          ref={input}
          id={field}
          type="text"
          role="combobox"
          autoComplete="off"
          className="ui-field-input ui-combo-input"
          aria-label={props["aria-label"]}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={open && shows}
          aria-controls={list}
          aria-activedescendant={open && active >= 0 ? `${list}-${active}` : undefined}
          aria-invalid={props.error ? true : undefined}
          aria-disabled={held ? true : undefined}
          aria-describedby={said}
          disabled={held ? undefined : props.disabled}
          readOnly={held}
          value={shown}
          placeholder={placeholder}
          onChange={(event) => {
            if (held) return;
            const next = event.target.value;
            type(next);
            setActive(firstOf(visibleFor(next)));
            if (!open) {
              setOpen(true);
              props.onOpenChange?.(true);
            }
          }}
          onClick={() => (open ? undefined : show())}
          onFocus={(event) => {
            if (!many) event.currentTarget.select();
            why.focus(event);
          }}
          onBlur={() => {
            close();
            why.blur();
          }}
          onKeyDown={(event) => {
            why.key(event);
            keyed(event);
          }}
        />
        {why.node}
        {props.name
          ? chosen.map((value) => <input key={value} type="hidden" name={props.name} value={value} />)
          : null}
      </div>
      {open && shows ? (
        <div
          ref={pop}
          id={list}
          role="listbox"
          popover="manual"
          className="ui-menu ui-combo-menu"
          aria-multiselectable={many ? true : undefined}
          aria-labelledby={props.label ? `${field}-label` : undefined}
          aria-label={props.label ? undefined : props["aria-label"]}
          // Nothing in the list takes the focus from the field.
          onPointerDown={(event) => event.preventDefault()}
        >
          {visible.map((option, at) => {
            const heads = option.group !== undefined && (at === 0 || groupOf(at - 1) !== option.group);
            const picked = chosen.includes(option.value);
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
                  className="ui-menu-item"
                  aria-selected={picked}
                  aria-disabled={option.disabled ? true : undefined}
                  data-active={at === active ? "" : undefined}
                  onPointerMove={() => (option.disabled ? undefined : setActive(at))}
                  onClick={() => choose(option)}
                >
                  {option.start ? <span className="ui-start">{option.start}</span> : null}
                  <span className="ui-menu-words">
                    {option.label}
                    {option.hint ? <small className="ui-menu-hint">{option.hint}</small> : null}
                  </span>
                  {picked ? <CheckIcon size={16} className="ui-menu-tick" aria-hidden="true" /> : null}
                </div>
              </Fragment>
            );
          })}
          {visible.length === 0 && props.empty !== undefined ? (
            <div className="ui-menu-empty" role="status">
              {props.empty}
            </div>
          ) : null}
          {props.footer ? <div className="ui-menu-foot">{props.footer}</div> : null}
        </div>
      ) : null}
      <FieldHint field={field} hint={props.hint} />
    </div>
  );
}
