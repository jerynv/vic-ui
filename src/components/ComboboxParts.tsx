import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";

/** The host supplies the currently visible options, in their rendered order. */
export interface ComboboxOption { value: string; label: string; disabled?: boolean }
export interface ComboboxRootProps {
  label: string;
  items: readonly ComboboxOption[];
  children: ReactNode;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Defaults to true. Use false for a permanently visible picker. */
  closeOnSelect?: boolean;
}
interface Controller {
  label: string;
  items: readonly ComboboxOption[];
  value: string | null;
  query: string;
  open: boolean;
  disabled: boolean;
  active: string | null;
  listId: string;
  optionId: (value: string) => string;
  input: { current: HTMLInputElement | null };
  list: { current: HTMLDivElement | null };
  restrictSearch: (disabled: boolean, readOnly: boolean) => void;
  reveal: () => void;
  point: (value: string) => void;
  move: (direction: "next" | "previous" | "first" | "last") => void;
  setQuery: (query: string) => void;
  setOpen: (open: boolean) => void;
  choose: (value: string) => void;
}
const Context = createContext<Controller | null>(null);
function useController() {
  const context = useContext(Context);
  if (!context) throw new Error("Combobox parts require a ComboboxRoot.");
  return context;
}
const classes = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ");
// Encode code points rather than inserting application keys into selectors or IDs.
const keyId = (value: string) => Array.from(value, char => char.codePointAt(0)!.toString(16)).join("-") || "empty";

/** Inline selection controller. The host owns filtering, layout and any enclosing popup. */
export function ComboboxRoot(props: ComboboxRootProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState({ disabled: false, readOnly: false });
  const restrictSearch = useCallback((disabled: boolean, readOnly: boolean) => {
    setSearch(previous => previous.disabled === disabled && previous.readOnly === readOnly ? previous : { disabled, readOnly });
  }, []);
  const [ownValue, setOwnValue] = useState(props.defaultValue ?? null);
  const [ownQuery, setOwnQuery] = useState(props.defaultQuery ?? "");
  const [ownOpen, setOwnOpen] = useState(props.defaultOpen ?? true);
  const [pointed, setPointed] = useState<{ value: string; query: string } | null>(null);
  const value = props.value === undefined ? ownValue : props.value;
  const query = props.query ?? ownQuery;
  const open = props.open ?? ownOpen;
  const disabled = Boolean(props.disabled || search.disabled);
  const locked = () => disabled || search.readOnly || Boolean(input.current?.disabled || input.current?.readOnly);
  const enabled = props.items.filter(item => !item.disabled);
  const keys = new Set(props.items.map(item => item.value));
  if (keys.size !== props.items.length) throw new Error("ComboboxRoot items require unique values.");
  const candidate = pointed?.query === query ? pointed.value : null;
  const active = open && !disabled && !search.readOnly
    ? (enabled.find(item => item.value === candidate) ?? enabled.find(item => item.value === value) ?? enabled[0])?.value ?? null
    : null;
  const optionId = (key: string) => `${id}-option-${keyId(key)}`;
  const setOpen = (next: boolean) => {
    if (disabled || next === open) return;
    if (props.open === undefined) setOwnOpen(next);
    props.onOpenChange?.(next);
  };
  const reveal = (key: string | null = active) => {
    if (key === null) return;
    const viewport = list.current;
    const field = input.current;
    const element = field?.ownerDocument.getElementById(optionId(key));
    if (!viewport || !element || !viewport.contains(element) || field?.ownerDocument.activeElement !== field) return;
    const row = element.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();
    if (row.top < frame.top) viewport.scrollTop -= frame.top - row.top;
    else if (row.bottom > frame.bottom) viewport.scrollTop += row.bottom - frame.bottom;
  };
  const point = (next: string) => {
    if (!locked() && enabled.some(item => item.value === next)) {
      setPointed({ value: next, query });
      reveal(next);
    }
  };
  useEffect(() => { if (!open) setPointed(null); }, [open]);
  useEffect(() => { reveal(); }, [active, id, props.items]);
  const controller: Controller = {
    label: props.label, items: props.items, value, query, open, disabled, active,
    listId: `${id}-list`, optionId, input, list, restrictSearch, reveal, point, setOpen,
    setQuery(next) {
      if (locked()) return;
      if (next !== query) {
        if (props.query === undefined) setOwnQuery(next);
        props.onQueryChange?.(next);
      }
      setOpen(true);
    },
    move(direction) {
      if (locked()) return;
      const current = enabled.findIndex(item => item.value === active);
      const index = direction === "first" ? 0 : direction === "last" ? enabled.length - 1
        : direction === "next" ? Math.min(current + 1, enabled.length - 1)
          : current < 0 ? enabled.length - 1 : Math.max(current - 1, 0);
      if (enabled[index]) point(enabled[index].value);
      setOpen(true);
    },
    choose(next) {
      if (!open || locked() || !enabled.some(item => item.value === next)) return;
      // Focus before notifying the owner, which may unmount the whole picker.
      input.current?.focus({ preventScroll: true });
      if (next !== value) {
        if (props.value === undefined) setOwnValue(next);
        props.onValueChange?.(next);
      }
      if (props.closeOnSelect !== false) setOpen(false);
    },
  };
  return <Context.Provider value={controller}>{props.children}</Context.Provider>;
}

export type ComboboxSearchProps = Omit<ComponentPropsWithRef<"input">, "value" | "defaultValue" | "onChange" | "role" | "type">;
/** A named native input; focus stays here while options are traversed. */
export function ComboboxSearch({ ref, className, onKeyDown, onFocus, onBlur, onClick, disabled, ...props }: ComboboxSearchProps) {
  const box = useController();
  const [focused, setFocused] = useState(false);
  const off = box.disabled || disabled;
  useLayoutEffect(() => {
    box.restrictSearch(Boolean(disabled), Boolean(props.readOnly));
    return () => box.restrictSearch(false, false);
  }, [box.restrictSearch, disabled, props.readOnly]);
  return <input {...props} ref={node => {
    box.input.current = node;
    if (typeof ref === "function") {
      const cleanup = ref(node);
      if (cleanup) return () => { box.input.current = null; cleanup(); };
    } else if (ref) ref.current = node;
  }} className={classes("ui-field-input ui-native-input ui-combobox-search", className)}
    type="text" role="combobox" autoComplete="off" disabled={off}
    aria-label={props["aria-label"] ?? (props["aria-labelledby"] ? undefined : box.label)}
    aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={box.open}
    aria-controls={box.open ? box.listId : undefined}
    aria-activedescendant={!off && focused && box.active !== null ? box.optionId(box.active) : undefined}
    value={box.query} onChange={event => { if (!off && !props.readOnly) box.setQuery(event.target.value); }}
    onFocus={event => { setFocused(true); onFocus?.(event); if (!event.defaultPrevented && !off) { box.setOpen(true); box.reveal(); } }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    onClick={event => { onClick?.(event); if (!event.defaultPrevented && !off) box.setOpen(true); }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (event.defaultPrevented || off || props.readOnly || event.nativeEvent.isComposing || event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const direction = event.key === "ArrowDown" ? "next" : event.key === "ArrowUp" ? "previous"
        : box.open && event.key === "Home" ? "first" : box.open && event.key === "End" ? "last" : null;
      if (direction) { event.preventDefault(); box.move(direction); }
      else if (event.key === "Enter" && box.open) {
        event.preventDefault();
        if (box.active !== null) box.choose(box.active);
      } else if (event.key === "Escape" && box.open) {
        event.preventDefault(); event.stopPropagation(); box.setOpen(false);
      }
    }} />;
}

export type ComboboxListProps = Omit<ComponentPropsWithRef<"div">, "id" | "role" | "tabIndex">;
/** Render every visible item here, in the order supplied to Root. Rail and footer stay outside. */
export function ComboboxList({ ref, className, ...props }: ComboboxListProps) {
  const box = useController();
  if (!box.open) return null;
  return <div {...props} ref={node => {
    box.list.current = node;
    if (typeof ref === "function") {
      const cleanup = ref(node);
      if (cleanup) return () => { box.list.current = null; cleanup(); };
    } else if (ref) ref.current = node;
  }} id={box.listId} role="listbox" tabIndex={-1} aria-label={props["aria-label"] ?? (props["aria-labelledby"] ? undefined : box.label)}
    aria-disabled={box.disabled || undefined} className={classes("ui-combobox-list", className)} />;
}

export type ComboboxItemProps = Omit<ComponentPropsWithRef<"div">, "id" | "role" | "tabIndex"> & { value: string };
export function ComboboxItem({ value, className, onPointerMove, onPointerDown, onClick, ...props }: ComboboxItemProps) {
  const box = useController();
  const item = box.items.find(item => item.value === value);
  if (!box.open || !item) return null;
  const off = box.disabled || item.disabled;
  return <div {...props} role="option" id={box.optionId(value)}
    aria-selected={box.value === value} aria-disabled={off || undefined}
    data-active={box.active === value ? "" : undefined} className={classes("ui-combobox-item", className)}
    onPointerMove={event => { onPointerMove?.(event); if (!event.defaultPrevented && !off && event.pointerType !== "touch") box.point(value); }}
    onPointerDown={event => { onPointerDown?.(event); if (event.button === 0 && event.pointerType !== "touch") event.preventDefault(); }}
    onClick={event => { onClick?.(event); if (!event.defaultPrevented && !off) box.choose(value); }} />;
}

export type ComboboxGroupProps = ComponentPropsWithRef<"div"> & { label: ReactNode };
export function ComboboxGroup({ label, className, children, ...props }: ComboboxGroupProps) {
  const id = useId();
  return <div {...props} role="group" aria-labelledby={id} className={classes("ui-combobox-group", className)}>
    <div id={id} className="ui-combobox-group-label">{label}</div>{children}
  </div>;
}

export type ComboboxEmptyProps = ComponentPropsWithRef<"div">;
/** Keep outside List so its live announcement is not an option. */
export function ComboboxEmpty({ className, children, ...props }: ComboboxEmptyProps) {
  const box = useController();
  if (!box.open) return null;
  return <div {...props} role="status" aria-live="polite" aria-atomic="true" className={classes("ui-combobox-empty", className)}>
    {box.items.length === 0 ? children : null}
  </div>;
}
