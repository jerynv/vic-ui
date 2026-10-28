import type { ReactNode } from "react";
import { XIcon } from "../icons/icons";
import { IconButton } from "./IconButton";

/**
 * A file on its way somewhere, as a small card: a picture of it (`preview`, an address the
 * caller owns) or an `icon`, its name cut to fit, its size, and a remove button while it can
 * still be taken off. `sending` draws a thin bar along its foot: how far where `progress` (0
 * to 1) is known, and under way where it is not; a card that is sending offers no remove.
 * It is one control's height, so it can stand in a row of buttons without changing its height.
 * `look="card"` is the taller card a tray of attached files lays out: a larger picture, its
 * name over `meta` (what it is and how large), the remove button at its end.
 */
export function FileChip(props: {
  name: string;
  /** The size in words (`"2.4 MB"`). */
  size?: string;
  /** The card's second line ("PNG, 2.4 MB"); the chip shows `size` instead. */
  meta?: string;
  look?: "chip" | "card";
  preview?: string | null;
  icon?: ReactNode;
  sending?: boolean;
  progress?: number | null;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}) {
  const known = props.progress !== undefined && props.progress !== null;
  const share = known ? Math.min(1, Math.max(0, props.progress!)) : 0;
  return (
    <span className={["ui-file-chip", props.className ?? ""].filter(Boolean).join(" ")} data-sending={props.sending ? "" : undefined} data-look={props.look === "card" ? "card" : undefined} title={props.name}>
      {props.preview ? <img className="ui-file-chip-thumb" src={props.preview} alt="" /> : <span className="ui-file-chip-thumb">{props.icon}</span>}
      {props.look === "card" ? (
        <span className="ui-file-chip-words">
          <span className="ui-file-chip-name">{props.name}</span>
          <span className="ui-file-chip-size">{props.meta ?? props.size}</span>
        </span>
      ) : (
        <>
          <span className="ui-file-chip-name">{props.name}</span>
          {props.size ? <span className="ui-file-chip-size">{props.size}</span> : null}
        </>
      )}
      {props.onRemove && !props.sending ? <IconButton className="ui-file-chip-x" icon={<XIcon size={14} />} label={props.removeLabel ?? `Take ${props.name} off`} onClick={props.onRemove} /> : null}
      {props.sending ? (
        <span
          className="ui-file-chip-bar"
          role="progressbar"
          aria-label={`Sending ${props.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={known ? Math.round(share * 100) : undefined}
          data-unknown={known ? undefined : ""}
        >
          <span style={known ? { width: `${share * 100}%` } : undefined} />
        </span>
      ) : null}
    </span>
  );
}
