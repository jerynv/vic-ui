import type { HTMLAttributes, ReactNode } from "react";
import { Link } from "./Link";
import type { Icon } from "../icons/icons";
import type { Hue } from "./hue";

/**
 * A group of rows under one heading: a small mark in the group's hue, a short heading, its
 * count, and at its end where the rest is (`more`, usually a `RowsMore`), then whatever the
 * group holds, which is `Rows` of `Row` or what is said in their place. `icon: null` keeps
 * the mark's room empty, for a placeholder that does not yet know which group comes first.
 */
export function RowGroup(
  props: Omit<HTMLAttributes<HTMLElement>, "title"> & { title: ReactNode; label?: string | undefined; icon?: Icon | null | undefined; hue?: Hue | undefined; count?: ReactNode; more?: ReactNode; children?: ReactNode },
) {
  const { title, label, icon: Mark, hue, count, more, children, className, ...rest } = props;
  return (
    <section className={className ? `ui-list ${className}` : "ui-list"} data-hue={hue} aria-label={label ?? (typeof title === "string" ? title : undefined)} {...rest}>
      <div className="ui-list-head">
        {Mark !== undefined ? (
          <span className="ui-list-mark" aria-hidden="true">
            {Mark ? <Mark size={14} /> : <span className="ui-list-mark-room" />}
          </span>
        ) : null}
        <h2 className="ui-list-title">{title}</h2>
        {count !== undefined && count !== null && count !== "" ? <span className="ui-list-count">{count}</span> : null}
        {more ? <span className="ui-list-more">{more}</span> : null}
      </div>
      {children}
    </section>
  );
}

/** Where the rest of a group is: quiet words at the head's end that open the whole list. */
export function RowsMore(props: { to: string; children: ReactNode }) {
  return (
    <Link to={props.to} className="ui-list-more-link">
      {props.children}
    </Link>
  );
}

/** The rows of a group, one under another. */
export function Rows(props: { children: ReactNode; className?: string | undefined; "aria-hidden"?: boolean | undefined }) {
  return (
    <ul className={props.className ? `ui-list-rows ${props.className}` : "ui-list-rows"} aria-hidden={props["aria-hidden"]}>
      {props.children}
    </ul>
  );
}

/**
 * One row of one line at one height: a mark, the words (a link over the whole row where `to`
 * is given, which is when the row lights under the pointer), where it is, when, and its one
 * action at the end, which sits above the row's link so it is pressed on its own. `quiet`
 * words say something in place of a row. `after` is drawn under the row, inside its item,
 * for a refusal that belongs to it.
 */
export function Row(props: {
  to?: string | undefined;
  state?: unknown;
  mark: ReactNode;
  words: ReactNode;
  title?: string | undefined;
  place?: ReactNode;
  when?: ReactNode;
  end?: ReactNode;
  after?: ReactNode;
  quiet?: boolean;
}) {
  return (
    <li>
      <div className="ui-list-row" data-quiet={props.quiet ? "" : undefined}>
        <span className="ui-list-row-mark">{props.mark}</span>
        {props.to ? (
          <Link to={props.to} state={props.state} className="ui-list-row-words ui-list-row-link" title={props.title}>
            {props.words}
          </Link>
        ) : (
          <span className="ui-list-row-words" title={props.title}>
            {props.words}
          </span>
        )}
        {props.place ? <span className="ui-list-row-place">{props.place}</span> : null}
        {props.when ? <span className="ui-list-row-when">{props.when}</span> : null}
        {props.end ? <span className="ui-list-row-end">{props.end}</span> : null}
      </div>
      {props.after}
    </li>
  );
}
