import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, InfoCircleIcon, XIcon } from "../icons/icons";
import { toneClass, type Tone } from "./Badge";

/** The mark each tone leads with, so a notice is told by its shape as well as its colour. */
const MARKS: Record<Tone, ReactNode> = {
  danger: <AlertCircleIcon />,
  caution: <AlertTriangleIcon />,
  settled: <CheckCircleIcon />,
  moving: <ClockIcon />,
  neutral: <InfoCircleIcon />,
};

/**
 * Something to read before going on: a rounded tint of its tone, led by a short rounded bar
 * and the tone's mark in its ink, then the title and the words at one size, and any action
 * under the words in the same column, so the notice reads down one edge. Danger is announced as an alert and draws its words in its
 * ink, as a refusal does; every other tone is read where it stands. The words stay strong on
 * every tint, since muted words fail on a light one. With `onDismiss` it ends in a close
 * button, which is how a refusal too long for a field's label line (`FieldHead`) is put away.
 */
export function Notice(
  props: Omit<HTMLAttributes<HTMLDivElement>, "title"> & { tone?: Tone; title?: ReactNode; icon?: ReactNode; action?: ReactNode; onDismiss?: () => void; dismissLabel?: string; children?: ReactNode },
) {
  const { tone = "neutral", title, icon, action, onDismiss, dismissLabel = "Dismiss", className, children, ...rest } = props;
  const classes = ["ui-notice", toneClass(tone), tone === "danger" ? "ui-notice-danger" : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={classes} role={tone === "danger" ? "alert" : undefined} {...rest}>
      <span className="ui-notice-bar" aria-hidden="true" />
      <span className="ui-notice-icon" aria-hidden="true">
        {icon ?? MARKS[tone]}
      </span>
      <div className="ui-notice-body">
        {title ? <p className="ui-notice-title">{title}</p> : null}
        {children ? <div className="ui-notice-words">{children}</div> : null}
        {action ? <div className="ui-notice-action">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className="ui-notice-dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          <XIcon size={14} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
