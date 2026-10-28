import { useRef, type ReactNode } from "react";

/** The longest error the label's line holds; anything longer is a notice (`Notice` with `onDismiss`). */
export const SHORT_ERROR = 56;

/** Whether words fit the label's line, so a page can say a refusal in place or in a notice. */
export function isShortError(words: string | null | undefined): boolean {
  return !!words && words.length <= SHORT_ERROR;
}

/**
 * The line above every field: its label, and in the same cell the short error that takes the
 * label's place, in the danger ink, so an error arriving or going moves nothing below. The
 * label stays the field's name to a screen reader while the error stands over it; the error
 * is announced as it arrives. A field named by `aria-label` alone reserves this line only
 * where it may show an error (`error` passed, even empty).
 */
export function FieldHead(props: { field: string; label?: ReactNode; labelId?: string; error?: ReactNode }) {
  const on = !!props.error;
  // The last words said, kept so they fade out rather than vanish.
  const last = useRef<ReactNode>(null);
  if (on) last.current = props.error;
  if (!props.label && props.error === undefined) return null;
  return (
    <div className="ui-field-head" data-error={on ? "" : undefined}>
      {props.label ? (
        <label className="ui-field-label" id={props.labelId} htmlFor={props.field}>
          {props.label}
        </label>
      ) : (
        <span className="ui-field-label" aria-hidden="true" />
      )}
      {on ? (
        <p key="on" id={`${props.field}-error`} className="ui-field-error" role="alert" title={typeof props.error === "string" ? props.error : undefined}>
          {props.error}
        </p>
      ) : (
        <p key="off" className="ui-field-error" aria-hidden="true" inert>
          {last.current}
        </p>
      )}
    </div>
  );
}

/** The line under a field that helps, drawn whenever there is a hint, so nothing comes or goes under the box. */
export function FieldHint(props: { field: string; hint?: ReactNode }) {
  if (!props.hint) return null;
  return (
    <p id={`${props.field}-hint`} className="ui-field-hint">
      {props.hint}
    </p>
  );
}

/** What a field's `aria-describedby` names: its error, its hint and the reason it is held. */
export function describedBy(field: string, error: ReactNode, hint: ReactNode, reason?: string): string | undefined {
  return [error ? `${field}-error` : undefined, hint ? `${field}-hint` : undefined, reason].filter(Boolean).join(" ") || undefined;
}
