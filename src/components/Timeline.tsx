import type { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

/**
 * The pieces a timeline of messages is drawn with: the rule a day or the first unread line
 * starts with, what people said back as small pills, and the bar of actions laid over a
 * message's corner.
 */

/**
 * A rule across the timeline with its words on it: a day, centred and quiet, or where the
 * new messages start (`look="new"`), the words at its end in ink. `id` lets a page find it.
 */
export function TimelineDivider(props: { children: ReactNode; look?: "day" | "new"; id?: string; className?: string }) {
  const look = props.look ?? "day";
  return (
    <div id={props.id} className={["ui-divider", `ui-divider-${look}`, props.className ?? ""].filter(Boolean).join(" ")} role="separator" aria-label={typeof props.children === "string" ? props.children : undefined}>
      <span className="ui-divider-words">{props.children}</span>
    </div>
  );
}

/**
 * Something said back to a message, as a small pill: its mark and how many. Its word and who
 * said it are its accessible name and its tooltip. The reader's own is outlined in ink;
 * pressing says it or takes it back.
 */
export function Reaction(props: { icon: ReactNode; label: string; count: number; pressed: boolean; onPress: () => void; tip?: ReactNode }) {
  const pill = (
    <button type="button" className="ui-reaction" aria-pressed={props.pressed} aria-label={`${props.label}, ${props.count}${props.pressed ? ", you among them" : ""}`} onClick={props.onPress}>
      <span className="ui-reaction-mark" aria-hidden="true">
        {props.icon}
      </span>
      <span className="ui-reaction-count" aria-hidden="true">
        {props.count}
      </span>
    </button>
  );
  return <Tooltip content={props.tip ?? props.label}>{pill}</Tooltip>;
}

/** A row of reactions under a message. */
export function Reactions(props: { children: ReactNode }) {
  return <div className="ui-reactions">{props.children}</div>;
}

/**
 * A compact pill of dense icon buttons on the floating surface, laid over the corner of
 * whatever it acts on without moving anything; the caller places it. `ActionBarRule` draws a
 * hairline between groups inside it.
 */
export function ActionBar(props: { "aria-label": string; children: ReactNode; className?: string; role?: "toolbar" | "group" }) {
  return (
    <div className={["ui-actionbar", props.className ?? ""].filter(Boolean).join(" ")} role={props.role ?? "toolbar"} aria-label={props["aria-label"]}>
      {props.children}
    </div>
  );
}

export function ActionBarRule() {
  return <span className="ui-actionbar-rule" aria-hidden="true" />;
}
