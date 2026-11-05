// Adapted from canonical V-Client 555625f4; source transfer authorized by the owner.
import { createContext, useContext, type ReactNode, type MouseEvent } from "react";
import { Link } from "./Link";
import { Textarea } from "./Textarea";

/**
 * A quiet panel of rows, as Your account and every section of Settings lay a thing out: one
 * fill, no edge, hairlines between its rows, every row at one height. It is a description list
 * of a label and its value on one line (`PanelField`), a list of things each with a mark, its
 * words and what to do with it at the end (`PanelItem`), or, as a `div`, settings' rows that
 * mix the two; `PanelBlock` is a row holding something wider than one line. `PanelHead` is the
 * small heading over a panel and `Actions` the list of quiet actions at a page's foot, what
 * destroys in the danger ink.
 */

type Kind = "dl" | "ul" | "div";
const PanelKind = createContext<Kind>("div");

function join(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}

/** The small heading over a panel, with anything that acts on the whole panel at its end. */
export function PanelHead(props: { children: ReactNode; actions?: ReactNode; className?: string | undefined }) {
  if (!props.actions) return <h2 className={join("ui-panel-head", props.className)}>{props.children}</h2>;
  return (
    <div className={join("ui-panel-head ui-panel-head-row", props.className)}>
      <h2 className="ui-panel-head-words">{props.children}</h2>
      <span className="ui-panel-head-actions">{props.actions}</span>
    </div>
  );
}

/** The panel itself: `dl` for labels and values, `ul` for a list of things, `div` for rows of both. */
export function Panel(props: { as?: Kind; "aria-label"?: string | undefined; className?: string | undefined; children: ReactNode }) {
  const As = props.as ?? "div";
  return (
    <PanelKind.Provider value={As}>
      <As className={join("ui-panel", props.className)} aria-label={props["aria-label"]}>
        {props.children}
      </As>
    </PanelKind.Provider>
  );
}

/**
 * A label and its value on one line. `note` is a second line under the label, for a value or a
 * state; `error` takes the note's place in the danger ink, in the same cell, so it moves nothing.
 * `control` lays out controls at the end rather than clipping one line of words.
 */
export function PanelField(props: { label: ReactNode; note?: ReactNode; error?: string | null | undefined; control?: boolean; children?: ReactNode }) {
  const kind = useContext(PanelKind);
  const Label = kind === "dl" ? "dt" : "div";
  const Value = kind === "dl" ? "dd" : "div";
  const error = props.error ?? null;
  const under = props.note !== undefined && props.note !== null && props.note !== false;
  const has = props.children !== undefined && props.children !== null && props.children !== false;
  return (
    <div className="ui-panel-field">
      <Label className="ui-panel-label">
        {!under && props.error !== undefined ? (
          // No note under the label: a refusal takes the label's own place, in the same cell, so the
          // row keeps its height whatever it says.
          <span className="ui-panel-label-swap" data-error={error ? "" : undefined}>
            <span className="ui-panel-label-words" aria-hidden={error ? true : undefined}>
              {props.label}
            </span>
            {error ? (
              <span className="ui-panel-note-error" role="alert">
                {error}
              </span>
            ) : null}
          </span>
        ) : under ? (
          <span className="ui-panel-label-stack">
            <span>{props.label}</span>
            <span className="ui-panel-note" data-error={error ? "" : undefined}>
              <span className="ui-panel-note-words" aria-hidden={error ? true : undefined}>
                {props.note}
              </span>
              {error ? (
                <span className="ui-panel-note-error" role="alert">
                  {error}
                </span>
              ) : null}
            </span>
          </span>
        ) : (
          props.label
        )}
      </Label>
      {has ? <Value className={props.control ? "ui-panel-value ui-panel-control" : "ui-panel-value"}>{props.children}</Value> : null}
    </div>
  );
}

/**
 * One thing in the list: its mark, its words, and at its end what to do with it. Given `to` (a
 * path of this app) or `href`, the whole row is the link and lights under the pointer, with
 * `end` drawn inside it (a chevron). Otherwise `end` holds several controls in a run of their
 * own, and `action` is the row's one quiet action, drawn as it is. `after` is drawn under the row inside its item, for a
 * refusal that belongs to it.
 */
export function PanelItem(props: { mark?: ReactNode; children: ReactNode; end?: ReactNode; action?: ReactNode; to?: string | undefined; href?: string | undefined; after?: ReactNode; mono?: boolean; className?: string | undefined }) {
  const kind = useContext(PanelKind);
  const Item = kind === "ul" ? "li" : "div";
  const words = <span className={props.mono ? "ui-panel-words ui-panel-mono" : "ui-panel-words"}>{props.children}</span>;
  if (props.to || props.href) {
    const inner = (
      <>
        {props.mark}
        {words}
        {props.end}
      </>
    );
    return (
      <Item className={join("ui-panel-item", props.className)}>
        {props.to ? (
          <Link className="ui-panel-link" to={props.to}>
            {inner}
          </Link>
        ) : (
          <a className="ui-panel-link" href={props.href}>
            {inner}
          </a>
        )}
        {props.after}
      </Item>
    );
  }
  return (
    <Item className={join("ui-panel-item", props.className)}>
      {props.mark}
      {words}
      {props.end ? <span className="ui-panel-end">{props.end}</span> : null}
      {props.action}
      {props.after}
    </Item>
  );
}

/** A row holding something wider than one line (a label over a list, a table, a sentence that wraps), with a note under its label where there is one. */
export function PanelBlock(props: { label?: ReactNode; note?: ReactNode; children?: ReactNode }) {
  const kind = useContext(PanelKind);
  const Item = kind === "ul" ? "li" : "div";
  return (
    <Item className="ui-panel-block">
      {props.label ? <p className="ui-panel-block-label">{props.label}</p> : null}
      {props.note ? <p className="ui-panel-note">{props.note}</p> : null}
      {props.children}
    </Item>
  );
}

/** The quiet actions at a page's foot, one line each with its mark. */
export function Actions(props: { children: ReactNode; "aria-label"?: string | undefined }) {
  return (
    <ul className="ui-actions" aria-label={props["aria-label"]}>
      {props.children}
    </ul>
  );
}

/** One action: a link of this app (`to`), a plain link (`href`) or a button (`onClick`); `danger` in the danger ink. */
export function Action(props: {
  icon: ReactNode;
  children: ReactNode;
  to?: string | undefined;
  href?: string | undefined;
  onClick?: (() => void) | undefined;
  danger?: boolean;
  disabled?: boolean;
  onPointerEnter?: (() => void) | undefined;
  onFocus?: (() => void) | undefined;
}) {
  const className = props.danger ? "ui-action ui-action-danger" : "ui-action";
  const blockDisabledLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (props.disabled) { event.preventDefault(); event.stopPropagation(); }
  };
  const face = (
    <>
      {props.icon}
      {props.children}
    </>
  );
  return (
    <li>
      {props.to ? (
        <Link className={className} to={props.to} aria-disabled={props.disabled || undefined} tabIndex={props.disabled ? -1 : undefined} onClick={blockDisabledLink} onPointerEnter={props.disabled ? undefined : props.onPointerEnter} onFocus={props.disabled ? undefined : props.onFocus}>
          {face}
        </Link>
      ) : props.href ? (
        <a className={className} href={props.href} aria-disabled={props.disabled || undefined} tabIndex={props.disabled ? -1 : undefined} onClick={blockDisabledLink} onPointerEnter={props.disabled ? undefined : props.onPointerEnter} onFocus={props.disabled ? undefined : props.onFocus}>
          {face}
        </a>
      ) : (
        <button type="button" className={className} disabled={props.disabled} onClick={props.onClick} onPointerEnter={props.disabled ? undefined : props.onPointerEnter} onFocus={props.disabled ? undefined : props.onFocus}>
          {face}
        </button>
      )}
    </li>
  );
}

/**
 * Words over several lines, as a row of a panel: the label (a refusal in its place) on the first
 * line, and the box the row's whole width under it, growing with what is typed. It is the library's
 * `Textarea`, so it types, counts and grows as every one does; `onCommit` is called
 * when it is left, which is when a setting saves.
 */
export function PanelText(props: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onCommit?: () => void;
  maxLength?: number;
  placeholder?: string;
  error?: string | null;
  rows?: number;
  disabled?: boolean;
  disabledReason?: string | undefined;
}) {
  const error = props.error ?? null;
  return (
    <div className="ui-panel-text">
      <div className="ui-panel-text-head">
        <span className="ui-panel-label-swap" data-error={error ? "" : undefined}>
          <span className="ui-panel-label-words" aria-hidden={error ? true : undefined}>
            {props.label}
          </span>
          {error ? (
            <span className="ui-panel-note-error" role="alert">
              {error}
            </span>
          ) : null}
        </span>
      </div>
      <Textarea
        aria-label={props.label}
        value={props.value}
        onValueChange={props.onValueChange}
        onBlur={() => props.onCommit?.()}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        rows={props.rows ?? 2}
        grow
        maxRows={8}
        aria-invalid={error ? true : undefined}
        disabled={props.disabled}
        disabledReason={props.disabledReason}
      />
    </div>
  );
}
