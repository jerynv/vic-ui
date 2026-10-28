import type { HTMLAttributes } from "react";

/**
 * A refusal or a failure said in a line of its own, beside what met it: the words in the
 * danger ink at the working size, with no box, announced as they arrive. A refusal at a
 * dialog's foot is `FootProblem`; one too long for a line, or one that stands for a whole
 * page, is a danger `Notice`. `as="span"` sets it inside a line of words, and `as="div"` holds several lines.
 */
export function Problem(props: HTMLAttributes<HTMLElement> & { as?: "p" | "span" | "div" }) {
  const { as = "p", className, ...rest } = props;
  const Tag = as;
  return <Tag role="alert" className={className ? `ui-problem ${className}` : "ui-problem"} {...rest} />;
}
