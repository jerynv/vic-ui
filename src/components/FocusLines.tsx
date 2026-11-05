import type { HTMLAttributes } from "react";

/*
 * The words around a form in the calm register (`FocusLayout`), apart from it so a page drawn
 * elsewhere (the booking's card) takes them without the layout.
 */

/** One quiet line somebody must read to act (where a code went, until when something stands), beside the control it is about. */
export function FocusLine(props: HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...rest } = props;
  return <p className={className ? `ui-focus-line ${className}` : "ui-focus-line"} {...rest} />;
}

/**
 * The quiet ways out of a form, on one row from its two ends: sending another code, using another
 * address. With `action` the row is itself a form posting there, for a way out that is one press
 * (signing out).
 */
export function FocusQuiet(props: HTMLAttributes<HTMLElement> & { action?: string }) {
  const { className, action, ...rest } = props;
  const name = className ? `ui-focus-quiet ${className}` : "ui-focus-quiet";
  return action ? <form method="post" action={action} className={name} {...rest} /> : <div className={name} {...rest} />;
}

/** The foot of the column: a quiet line with the way to the other place, its links underlined. */
export function FocusFoot(props: HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...rest } = props;
  return <p className={className ? `ui-focus-foot-line ${className}` : "ui-focus-foot-line"} {...rest} />;
}
