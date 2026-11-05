import type { ReactNode } from "react";

/** One fact: what it is, its value, and a small mark before the value where one helps it be found. */
export interface Fact {
  label: ReactNode;
  value: ReactNode;
  mark?: ReactNode;
}

/**
 * The few facts at the top of something's own page (when a call was, how long it took, who
 * started a recording), as a description list: each label over its value, side by side where
 * there is room and wrapping where there is not. A fact with nothing to say is left out by the
 * caller rather than drawn empty.
 */
export function Facts(props: { items: ReadonlyArray<Fact>; "aria-label"?: string; className?: string | undefined }) {
  return (
    <dl className={props.className ? `ui-facts ${props.className}` : "ui-facts"} aria-label={props["aria-label"]}>
      {props.items.map((fact, n) => (
        <div key={n} className="ui-fact">
          <dt className="ui-fact-label">{fact.label}</dt>
          <dd className="ui-fact-value">
            {fact.mark ? (
              <span className="ui-fact-mark" aria-hidden="true">
                {fact.mark}
              </span>
            ) : null}
            <span className="ui-fact-words">{fact.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
