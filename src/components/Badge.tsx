import type { HTMLAttributes, ReactNode } from "react";

/**
 * The four tones and the ink with none: danger for what has gone wrong,
 * caution for what must be read first, settled for what is done, moving for what is under way.
 */
export type Tone = "danger" | "caution" | "settled" | "moving" | "neutral";

/** The class that hands a part its tone's ink, tint and edge (`tokens.css`); none for neutral. */
export function toneClass(tone: Tone | undefined): string {
  return tone && tone !== "neutral" ? `tone-${tone}` : "";
}

/**
 * A state said in a word or two. Hairline in its tone is a standing state; `solid` fills it
 * with the tone's ink, the one that asks for a hand now. `dot` or `icon` leads the words, and
 * `count` follows them as a number. It always carries words, so the tone never says it alone,
 * and lower-case data reads as a sentence: its first letter is raised.
 */
export function Badge(props: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; solid?: boolean; dot?: boolean; icon?: ReactNode; count?: number; children: ReactNode }) {
  const { tone, solid, dot, icon, count, className, children, ...rest } = props;
  const classes = ["ui-badge", solid ? "ui-badge-solid" : "", toneClass(tone), className ?? ""].filter(Boolean).join(" ");
  return (
    <span className={classes} {...rest}>
      {dot ? <span className="ui-badge-dot" aria-hidden="true" /> : icon ? <span className="ui-badge-icon" aria-hidden="true">{icon}</span> : null}
      <span className="ui-badge-words">{children}</span>
      {count !== undefined ? <span className="ui-badge-count">{count}</span> : null}
    </span>
  );
}

/**
 * How many are waiting somewhere, as a number on a filled ground: unread messages, in the rail,
 * a conversation's row, Home and the tour alike. `label` is the words a screen reader hears
 * ("3 unread messages"), since the number is all that is drawn; past `max` it reads `max+`.
 */
export function Count(props: { value: number; label: string; max?: number; tone?: Tone; className?: string }) {
  const max = props.max ?? 99;
  const shown = props.value > max ? `${max}+` : String(props.value);
  const classes = ["ui-count", toneClass(props.tone), props.className ?? ""].filter(Boolean).join(" ");
  return (
    <span className={classes}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{props.label}</span>
    </span>
  );
}

/**
 * How many a heading holds, as a quiet number after its words: "Comments 4", "In it 3". It is
 * read with the heading, so it needs no words of its own. A count that is waiting for somebody
 * is `Count`, and a tab's is the tab's own.
 */
export function HeadCount(props: { value: ReactNode; className?: string }) {
  return <span className={props.className ? `ui-head-count ${props.className}` : "ui-head-count"}>{props.value}</span>;
}
