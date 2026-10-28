import type { HTMLAttributes, ReactNode } from "react";
import type { Hue } from "./hue";

/**
 * The shapes a place fills with, drawn faint behind an empty state as a hint of what will be
 * there: list rows with a mark, people's rows with a face, a table's columns, a chart's
 * boxes, a conversation's turns, a board's lanes and a file list.
 */
export type EmptyPreview = "rows" | "people" | "table" | "tree" | "chat" | "board" | "files" | "worklist";

/**
 * Where an empty state stands: across a whole page (`page`, centred in the room under its
 * header), in a pane of a split view (`pane`, the default), or in a card, a panel or a table's
 * body (`card`, smaller and with a smaller preview).
 */
export type EmptySize = "page" | "pane" | "card";

/**
 * What a place shows while it holds nothing: a quiet preview of what will fill it (`preview`),
 * one title, at most one short line saying what the place is for, and the one thing to do about
 * it with a quieter second beside it, all centred in the area it stands for. Without a preview,
 * `icon` sits on a small tile of `hue` (or the field's fill), as a refusal or a failure does;
 * `art` takes the tile's place for a drawing of its own. Pointing at it brings the preview's
 * first item up in `hue`, where the first thing made will land.
 * `drop` draws it as a well that takes files, and `dropping` says something is held over it;
 * the caller handles the drop itself, through the handlers it passes on.
 */
export function Empty(
  props: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
    preview?: EmptyPreview;
    size?: EmptySize;
    icon?: ReactNode;
    art?: ReactNode;
    title: ReactNode;
    line?: ReactNode;
    action?: ReactNode;
    secondary?: ReactNode;
    hue?: Hue;
    drop?: boolean;
    dropping?: boolean;
  },
) {
  const { preview, size, icon, art, title, line, action, secondary, hue, drop, dropping, className, ...rest } = props;
  return (
    <div
      className={className ? `ui-empty ${className}` : "ui-empty"}
      data-size={size ?? "pane"}
      data-drop={drop ? "" : undefined}
      data-dropping={dropping ? "" : undefined}
      data-hue={hue}
      {...rest}
    >
      {art ??
        (preview ? (
          <EmptyArt shape={preview} />
        ) : icon ? (
          <span className="ui-empty-mark" aria-hidden="true">
            {icon}
          </span>
        ) : null)}
      <p className="ui-empty-title">{title}</p>
      {line ? <p className="ui-empty-line">{line}</p> : null}
      {action || secondary ? (
        <div className="ui-empty-actions">
          {action}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}

/**
 * A list, a section of one or a part of a dialog with nothing in it, said in one quiet line
 * where its rows would start, at a row's height and with no box: "Nothing pinned", "Nobody
 * else is on it". A place that holds nothing at all is an `Empty`.
 */
export function EmptyLine(props: HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...rest } = props;
  return <p className={className ? `ui-list-empty ${className}` : "ui-list-empty"} {...rest} />;
}

/* The widths of each item's words, varied so the rows read as text rather than a grid. */
const WIDE = [62, 48, 70, 54];
const NARROW = [34, 26, 40, 30];

/** One item of a list: its mark, two lines of words and, where the shape has one, a pill at its end. */
function Row(props: { at: number; mark: "tile" | "face" | "file"; end?: boolean }) {
  return (
    <span className="ui-empty-art-row">
      <span className="ui-empty-art-mark" data-mark={props.mark} />
      <span className="ui-empty-art-words">
        <span className="ui-empty-bar" style={{ width: `${WIDE[props.at % WIDE.length]}%` }} />
        <span className="ui-empty-bar ui-empty-bar-soft" style={{ width: `${NARROW[props.at % NARROW.length]}%` }} />
      </span>
      {props.end ? <span className="ui-empty-art-pill" /> : null}
    </span>
  );
}

/**
 * The faint drawing of what a place fills with, in the page's own shapes and tokens and nothing
 * else, hidden from a screen reader. Exported so a placeholder can draw the same.
 */
export function EmptyArt(props: { shape: EmptyPreview }) {
  const { shape } = props;
  const three = [0, 1, 2];
  let body: ReactNode;
  if (shape === "rows" || shape === "people" || shape === "files" || shape === "worklist") {
    const mark = shape === "people" ? "face" : shape === "files" ? "file" : "tile";
    body = three.map((at) => <Row key={at} at={at} mark={mark} end={shape === "worklist" || shape === "people"} />);
  } else if (shape === "table") {
    body = (
      <>
        <span className="ui-empty-art-row ui-empty-art-head">
          {[30, 22, 18, 14].map((width, at) => (
            <span key={at} className="ui-empty-bar ui-empty-bar-soft" style={{ width: `${width}%` }} />
          ))}
        </span>
        {three.map((at) => (
          <span key={at} className="ui-empty-art-row ui-empty-art-cells">
            <span className="ui-empty-art-mark" data-mark="face" />
            {[WIDE[at] ?? 50, 40, 28, 20].map((width, cell) => (
              <span key={cell} className={cell === 0 ? "ui-empty-bar" : "ui-empty-bar ui-empty-bar-soft"} style={{ width: `${width * (cell === 0 ? 0.4 : 0.3)}%` }} />
            ))}
          </span>
        ))}
      </>
    );
  } else if (shape === "tree") {
    body = (
      <>
        <span className="ui-empty-art-node ui-empty-art-root">
          <span className="ui-empty-art-mark" data-mark="face" />
          <span className="ui-empty-bar" style={{ width: "55%" }} />
        </span>
        <span className="ui-empty-art-branch" />
        <span className="ui-empty-art-level">
          {three.map((at) => (
            <span key={at} className="ui-empty-art-node">
              <span className="ui-empty-art-mark" data-mark="face" />
              <span className="ui-empty-bar ui-empty-bar-soft" style={{ width: `${NARROW[at]! + 24}%` }} />
            </span>
          ))}
        </span>
      </>
    );
  } else if (shape === "chat") {
    body = three.map((at) => (
      <span key={at} className="ui-empty-art-turn" data-own={at === 1 ? "" : undefined}>
        <span className="ui-empty-art-mark" data-mark="face" />
        <span className="ui-empty-art-words">
          <span className="ui-empty-bar ui-empty-bar-soft" style={{ width: "22%" }} />
          <span className="ui-empty-bar" style={{ width: `${WIDE[at]! + 10}%` }} />
        </span>
      </span>
    ));
  } else {
    body = three.map((lane) => (
      <span key={lane} className="ui-empty-art-lane">
        <span className="ui-empty-bar ui-empty-bar-soft" style={{ width: "45%" }} />
        {Array.from({ length: 2 - (lane % 2) }, (_, at) => (
          <span key={at} className="ui-empty-art-card">
            <span className="ui-empty-bar" style={{ width: `${WIDE[(lane + at) % WIDE.length]}%` }} />
            <span className="ui-empty-bar ui-empty-bar-soft" style={{ width: "30%" }} />
          </span>
        ))}
      </span>
    ));
  }
  return (
    <span className="ui-empty-art" data-shape={shape} aria-hidden="true">
      {body}
    </span>
  );
}
