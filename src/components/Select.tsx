import { useAnchored } from "./Popover";
import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CheckIcon, ChevronDownIcon } from "../icons/icons";
import { textOf, toOptions, type Items } from "./items";
import { describedBy, FieldHead, FieldHint } from "./FieldHead";
import { useBlocked } from "./reason";

/**
 * A choice from a list, drawn by the page rather than the browser, so it looks the same in
 * every browser, on a phone and inside a dialog. The field is the box `TextField` draws; the
 * list opens on the floating surface every menu sits on, in the browser's top layer
 * (`popover`), so no dialog's overflow, transform or stacking can cut it off, and it stays in
 * the dialog's own tree, so pressing a choice is not a press outside the dialog.
 *
 * It is a combobox whose focus never leaves the field: the arrows, Home and End move through
 * the list, Enter or Space chooses, Escape and Tab close it, and typing a letter jumps to the
 * first choice that starts with what was typed. `items` is any shape `toOptions` reads;
 * `placeholder` is what the field says while nothing is chosen. A `name` posts the value with
 * its form.
 */
export function Select(props: {
  label?: ReactNode;
  "aria-label"?: string;
  items: Items;
  value: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  /** Why it cannot be chosen from yet, said on hover and focus. */
  disabledReason?: string | undefined;
  name?: string;
  id?: string;
  size?: "sm";
  className?: string;
}) {
  const made = useId();
  const field = props.id ?? made;
  const list = `${field}-list`;
  const said = describedBy(field, props.error, props.hint);
  const pairs = toOptions(props.items);
  const chosen = pairs.findIndex((one) => one.value === props.value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const trigger = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const held = useBlocked(props.disabled, props.disabledReason, trigger);

  const show = (at: number) => {
    setActive(at);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const choose = (at: number) => {
    const pair = pairs[at];
    if (!pair || pair.disabled) return;
    if (pair.value !== props.value) props.onValueChange?.(pair.value);
    close();
  };

  // Into the top layer and onto the field, kept there while the page scrolls or resizes, as every list is.
  useAnchored(open, () => trigger.current?.parentElement ?? null, pop, { matchWidth: true });

  // The active choice is kept in view as the arrows move through a long list.
  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${list}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, list]);

  // A press anywhere but the field and its list closes it.
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !pop.current?.contains(target)) close();
    };
    document.addEventListener("pointerdown", away, true);
    return () => document.removeEventListener("pointerdown", away, true);
  }, [open]);

  const jump = (key: string) => {
    const now = performance.now();
    typed.current = { text: now - typed.current.at < 700 ? typed.current.text + key.toLowerCase() : key.toLowerCase(), at: now };
    const from = open ? active : chosen;
    const order = [...pairs.keys()].map((i) => (i + from + 1) % pairs.length);
    const hit = order.find((i) => !pairs[i]!.disabled && textOf(pairs[i]!).toLowerCase().startsWith(typed.current.text));
    if (hit === undefined) return;
    if (open) setActive(hit);
    else if (pairs[hit]!.value !== props.value) props.onValueChange?.(pairs[hit]!.value);
  };

  const keyed = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = pairs.length - 1;
    const at = active < 0 ? Math.max(chosen, 0) : active;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) setActive(Math.min(at + 1, last));
        else show(Math.max(chosen, 0));
        return;
      case "ArrowUp":
        event.preventDefault();
        if (open) setActive(Math.max(at - 1, 0));
        else show(Math.max(chosen, 0));
        return;
      case "Home":
      case "End":
        if (!open) return;
        event.preventDefault();
        setActive(event.key === "Home" ? 0 : last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(at);
        else show(Math.max(chosen, 0));
        return;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      case "Tab":
        close();
        return;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) jump(event.key);
    }
  };

  const classes = ["ui-field", props.size === "sm" ? "ui-field-sm" : "", props.className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      <FieldHead field={field} label={props.label} labelId={`${field}-label`} error={props.error} />
      <div className="ui-field-box ui-select-box" data-invalid={props.error ? "" : undefined} data-open={open ? "" : undefined} data-disabled={props.disabled ? "" : undefined}>
        <button
          id={field}
          type="button"
          role="combobox"
          className="ui-field-input ui-select"
          aria-label={props["aria-label"]}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={list}
          aria-activedescendant={open && active >= 0 ? `${list}-${active}` : undefined}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={said}
          {...held.props}
          data-empty={chosen < 0 ? "" : undefined}
          onClick={() => (open ? close() : show(Math.max(chosen, 0)))}
          onKeyDown={keyed}
        >
          {chosen >= 0 && pairs[chosen]!.start ? <span className="ui-start">{pairs[chosen]!.start}</span> : null}
          <span className="ui-select-words">{chosen >= 0 ? pairs[chosen]!.label : (props.placeholder ?? "")}</span>
        </button>
        <ChevronDownIcon size={16} className="ui-select-caret" aria-hidden="true" />
        {held.node}
        {props.name ? <input type="hidden" name={props.name} value={props.value} /> : null}
      </div>
      {open ? (
        <div ref={pop} id={list} role="listbox" popover="manual" className="ui-menu" aria-labelledby={props.label ? `${field}-label` : undefined} aria-label={props.label ? undefined : props["aria-label"]}>
          {pairs.map((option, at) => (
            <Fragment key={option.value}>
              {option.group !== undefined && (at === 0 || pairs[at - 1]!.group !== option.group) ? (
                <div className="ui-menu-group" role="presentation">
                  {option.group}
                </div>
              ) : null}
              <div
                id={`${list}-${at}`}
                role="option"
                className="ui-menu-item"
                aria-selected={at === chosen}
                aria-disabled={option.disabled ? true : undefined}
                title={option.disabled ? option.reason : undefined}
                data-active={at === active ? "" : undefined}
                // The field keeps the focus, so the keys go on working after a press.
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => setActive(at)}
                onClick={() => choose(at)}
              >
                {option.start ? <span className="ui-start">{option.start}</span> : null}
                <span className="ui-menu-words">
                  {option.label}
                  {option.hint ? <small className="ui-menu-hint">{option.hint}</small> : null}
                </span>
                {at === chosen ? <CheckIcon size={16} className="ui-menu-tick" aria-hidden="true" /> : null}
              </div>
            </Fragment>
          ))}
        </div>
      ) : null}
      <FieldHint field={field} hint={props.hint} />
    </div>
  );
}

/** The labelled choice the way in draws: `Select` with its words given as `options`. */
export function SelectField({ options, ...rest }: Omit<Parameters<typeof Select>[0], "items"> & { label: ReactNode; options: Items }) {
  return <Select items={options} {...rest} />;
}
