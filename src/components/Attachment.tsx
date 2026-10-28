import { useState, type CSSProperties, type ReactNode } from "react";
import { DownloadSimpleIcon } from "../icons/icons";
import { ButtonLink } from "./Button";
import { Tooltip } from "./Tooltip";

/**
 * What somebody sent beside their words: pictures and films in a grid, a file as a card, and
 * several files of any kind as uniform tiles in one grid (`FileGrid`, `FileTile`). Every box takes its size before its bytes arrive, from the width and height the
 * caller was told, so nothing under it moves as it loads; a box whose shape is not known
 * keeps a fixed one and fits the picture inside it.
 */

export interface MediaItem {
  key: string;
  kind: "image" | "video";
  src: string;
  /** What it shows, for a reader who cannot see it: its name where nothing better is known. */
  alt: string;
  width: number | null;
  height: number | null;
  /** Opens it larger. A picture without one is drawn and does nothing. */
  onOpen?: () => void;
}

/** The most room one picture takes: 28rem across and 20rem down. */
export const MEDIA_WIDE = 448;
export const MEDIA_TALL = 320;

/** The box one picture or film is drawn in: its own shape within the bounds, or a fixed one. */
function oneBox(item: MediaItem): CSSProperties {
  const { width, height } = item;
  if (!width || !height) return item.kind === "video" ? { width: `${MEDIA_WIDE}px`, aspectRatio: "16 / 9" } : { width: "16rem", aspectRatio: "4 / 3" };
  const scale = Math.min(1, MEDIA_WIDE / width, MEDIA_TALL / height);
  return { width: `${Math.max(64, Math.round(width * scale))}px`, aspectRatio: `${width} / ${height}` };
}

function Tile(props: { item: MediaItem; style?: CSSProperties; more?: number | undefined; fit: "contain" | "cover" }) {
  const { item } = props;
  const [failed, setFailed] = useState(false);
  if (item.kind === "video") {
    // `#t=0.1` asks the browser for a frame to stand as the poster before anything is played.
    return (
      <span className="ui-media-tile" style={props.style}>
        {failed ? (
          <span className="ui-media-failed">This film could not be played here.</span>
        ) : (
          <video src={`${item.src}#t=0.1`} controls playsInline preload="metadata" aria-label={item.alt} onError={() => setFailed(true)} />
        )}
      </span>
    );
  }
  const picture = failed ? (
    <span className="ui-media-failed">This picture could not be shown.</span>
  ) : (
    <img src={item.src} alt={item.alt} loading="lazy" decoding="async" draggable={false} data-fit={props.fit} onError={() => setFailed(true)} />
  );
  const more = props.more ? (
    <span className="ui-media-more" aria-hidden="true">
      +{props.more}
    </span>
  ) : null;
  if (!item.onOpen) {
    return (
      <span className="ui-media-tile" style={props.style}>
        {picture}
        {more}
      </span>
    );
  }
  return (
    <button type="button" className="ui-media-tile" style={props.style} onClick={item.onOpen} aria-label={props.more ? `Open ${item.alt}, and ${props.more} more` : `Open ${item.alt}`}>
      {picture}
      {more}
    </button>
  );
}

/**
 * One picture at its own shape, or several in a grid of the same width: two side by side,
 * three as one tall and two stacked, four and more two by two with what is left counted on
 * the last.
 */
export function MediaGrid(props: { items: MediaItem[]; className?: string }) {
  const { items } = props;
  const first = items[0];
  if (!first) return null;
  if (items.length === 1) {
    return (
      <div className={["ui-media", props.className ?? ""].filter(Boolean).join(" ")}>
        <Tile item={first} style={oneBox(first)} fit="contain" />
      </div>
    );
  }
  const shown = items.slice(0, 4);
  const more = items.length - shown.length;
  return (
    <div className={["ui-media ui-media-grid", props.className ?? ""].filter(Boolean).join(" ")} data-count={shown.length}>
      {shown.map((item, index) => (
        <Tile key={item.key} item={item} fit="cover" more={index === shown.length - 1 && more > 0 ? more : undefined} />
      ))}
    </div>
  );
}

/**
 * A file that is not drawn in place: its mark, its name, what it is and how large, opened by
 * a press where it can be (`onOpen`), and downloaded from its end where `download` is given.
 * `preview` is laid over a box of fixed height above the name (the first page of a PDF), so
 * the card is its final size whether the preview arrives or not.
 */
export function FileCard(props: {
  name: string;
  /** What it is and how large, in a few words: "PDF, 2.4 MB". */
  meta: ReactNode;
  icon: ReactNode;
  onOpen?: () => void;
  download?: string;
  preview?: ReactNode;
  /** Drawn quieter and inert: a file still on its way. */
  pending?: boolean;
  className?: string;
}) {
  const body = (
    <>
      {props.preview !== undefined ? (
        <span className="ui-file-preview" aria-hidden="true">
          {props.preview}
        </span>
      ) : null}
      <span className="ui-file-row">
        <span className="ui-file-mark" aria-hidden="true">
          {props.icon}
        </span>
        <span className="ui-file-words">
          <span className="ui-file-name">{props.name}</span>
          <span className="ui-file-meta">{props.meta}</span>
        </span>
      </span>
    </>
  );
  const classes = ["ui-file", props.pending ? "is-pending" : "", props.className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {props.onOpen && !props.pending ? (
        <button type="button" className="ui-file-open" onClick={props.onOpen}>
          {body}
        </button>
      ) : props.download && !props.pending ? (
        <a className="ui-file-open" href={props.download} download={props.name}>
          {body}
        </a>
      ) : (
        <span className="ui-file-open">{body}</span>
      )}
      {props.download && props.onOpen && !props.pending ? (
        <Tooltip content="Download">
          <ButtonLink look="quiet" square className="ui-file-download" href={props.download} download={props.name} aria-label={`Download ${props.name}`} icon={<DownloadSimpleIcon size={16} />} />
        </Tooltip>
      ) : null}
    </div>
  );
}

/**
 * Several files together, as uniform tiles in one wrapping grid: as many columns of at least
 * 8.5rem as fit in 33rem, so a row of three on a wide page and two on a phone, every tile the
 * same size whatever it holds.
 */
export function FileGrid(props: { children: ReactNode; className?: string; "aria-label"?: string }) {
  return (
    <div className={["ui-file-grid", props.className ?? ""].filter(Boolean).join(" ")} role="group" aria-label={props["aria-label"]}>
      {props.children}
    </div>
  );
}

/**
 * One file in a `FileGrid`: a preview area of one fixed size (a picture's thumbnail cropped to
 * fill, a PDF's first page, or the kind's mark where nothing is drawn), its name and its kind
 * and size under it. The area is its size before anything arrives, so a preview landing moves
 * nothing. Opened by a press (`onOpen`), or downloaded by it where only `download` is given;
 * with both, Download sits at the end of the words.
 */
export function FileTile(props: {
  name: string;
  /** What it is and how large, in a few words: "PDF, 2.4 MB". */
  meta: ReactNode;
  /** The kind's mark, drawn in the preview area under any `preview`. */
  icon: ReactNode;
  /** Laid over the preview area, filling it: an `<img>` or `<video>` is cropped to fill. */
  preview?: ReactNode;
  /** A small mark over the preview's corner, as a film's play mark. */
  badge?: ReactNode;
  onOpen?: () => void;
  download?: string;
  /** Drawn quieter and inert: a file still on its way. */
  pending?: boolean;
  className?: string;
}) {
  const body = (
    <>
      <span className="ui-tile-preview" aria-hidden="true">
        <span className="ui-tile-mark">{props.icon}</span>
        {props.preview}
        {props.badge ? <span className="ui-tile-badge">{props.badge}</span> : null}
      </span>
      <span className="ui-tile-words">
        <span className="ui-tile-name">{props.name}</span>
        <span className="ui-tile-meta">{props.meta}</span>
      </span>
    </>
  );
  const classes = ["ui-tile", props.pending ? "is-pending" : "", props.className ?? ""].filter(Boolean).join(" ");
  const both = props.download !== undefined && !!props.onOpen && !props.pending;
  return (
    <div className={classes} data-download={both ? "" : undefined}>
      {props.onOpen && !props.pending ? (
        <button type="button" className="ui-tile-open" onClick={props.onOpen} aria-label={`Open ${props.name}`}>
          {body}
        </button>
      ) : props.download && !props.pending ? (
        <a className="ui-tile-open" href={props.download} download={props.name} aria-label={`Download ${props.name}`}>
          {body}
        </a>
      ) : (
        <span className="ui-tile-open">{body}</span>
      )}
      {both && props.download !== undefined ? (
        <Tooltip content="Download">
          <ButtonLink look="quiet" square className="ui-tile-download" href={props.download} download={props.name} aria-label={`Download ${props.name}`} icon={<DownloadSimpleIcon size={15} />} />
        </Tooltip>
      ) : null}
    </div>
  );
}
