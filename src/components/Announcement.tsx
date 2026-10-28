import type { ReactNode } from "react";
import { Link } from "./Link";
import { ArrowRightIcon } from "../icons/icons";
import type { Hue } from "./hue";

/**
 * The small pill the front page leads with: a tag, the words and an arrow, the whole of it
 * one link, to a page of this app by `to` or anywhere else by `href`. `hue` colours the tag
 * with one of the palette's hues; without it the tag is the fields' fill.
 */
export function Announcement(props: { tag?: ReactNode; to?: string; href?: string; hue?: Hue; className?: string; children: ReactNode }) {
  const className = props.className ? `ui-announcement ${props.className}` : "ui-announcement";
  const inner = (
    <>
      {props.tag ? (
        <span className="ui-announcement-tag" data-hue={props.hue}>
          {props.tag}
        </span>
      ) : null}
      <span className="ui-announcement-words">{props.children}</span>
      <ArrowRightIcon size={13} className="ui-announcement-arrow" aria-hidden="true" />
    </>
  );
  return props.to ? (
    <Link to={props.to} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={props.href} className={className}>
      {inner}
    </a>
  );
}
