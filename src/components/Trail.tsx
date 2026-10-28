import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { Link } from "./Link";

const wordsOf = (step: TrailStep) => step.text ?? (typeof step.label === "string" ? step.label : "");

/** A step above the page in its trail: where it goes and what the reader knows it as. */
export interface TrailStep {
  to: string;
  label: ReactNode;
  /** The words of `label`, where it is not words itself (a name still being read). */
  text?: string;
  /** Handed to the page it opens, as the calendar is handed the day an event is on. */
  state?: unknown;
}

/** The whole name, on hover, of a step drawn shorter than it is. */
function fullOnHover(event: ReactPointerEvent<HTMLElement>) {
  const element = event.currentTarget;
  const full = element.textContent ?? "";
  if (element.scrollWidth > element.clientWidth) element.title = full;
  else element.removeAttribute("title");
}

/**
 * Where a page sits: each step above it a link back, then the page's own name. Every
 * name is one the page has already read for its reader, so a trail never names what the
 * reader could not open. A step gives way before the page's name does: on a page it is
 * cut short and the name wraps, and on a phone every step but the nearest folds into one
 * link back to the first. `line` keeps it to one line, for a bar; `heading` false draws
 * the name as a span, where the page's heading is somewhere else.
 */
export function Trail(props: { steps: readonly TrailStep[]; here: ReactNode; heading?: boolean; line?: boolean; className?: string | undefined; hereClassName?: string | undefined }) {
  const Here = props.heading === false ? "span" : "h1";
  const [first] = props.steps;
  const folded = props.steps.slice(0, -1);
  return (
    <nav aria-label="Where you are" className={["ui-trail", props.line ? "ui-trail-line" : "", props.className ?? ""].filter(Boolean).join(" ")}>
      <ol>
        {first && folded.length > 0 ? (
          <li className="ui-trail-step ui-trail-more">
            <Link to={first.to} state={first.state} title={folded.map(wordsOf).join(" / ")} aria-label={wordsOf(first)}>
              …
            </Link>
          </li>
        ) : null}
        {props.steps.map((step, index) => (
          <li key={step.to} className={index < props.steps.length - 1 ? "ui-trail-step ui-trail-far" : "ui-trail-step"}>
            <Link to={step.to} state={step.state} onPointerEnter={fullOnHover}>
              {step.label}
            </Link>
          </li>
        ))}
        <li className="ui-trail-here" aria-current="page">
          <Here className={props.hereClassName} onPointerEnter={fullOnHover}>
            {props.here}
          </Here>
        </li>
      </ol>
    </nav>
  );
}
