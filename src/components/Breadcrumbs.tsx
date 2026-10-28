import { Fragment, type ReactNode } from "react";
import { Link } from "./Link";
import { ChevronRightIcon } from "../icons/icons";

/** One step of a trail: the page it links to and its words. */
export interface Crumb {
  to: string;
  label: ReactNode;
}

/**
 * Where a page sits, as the pages above it: each a link but the last, which is the page itself
 * (`aria-current`), with a chevron between. A long step is cut with an ellipsis rather than
 * pushing the trail onto a second line.
 */
export function Breadcrumbs(props: { trail: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Where you are" className={props.className ? `ui-crumbs ${props.className}` : "ui-crumbs"}>
      {props.trail.map((crumb, at) => (
        <Fragment key={crumb.to}>
          {at > 0 ? <ChevronRightIcon size={14} className="ui-crumbs-sep" aria-hidden="true" /> : null}
          {at === props.trail.length - 1 ? (
            <span className="ui-crumb" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link to={crumb.to} className="ui-crumb ui-crumb-link">
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
