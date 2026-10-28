import { useId, useLayoutEffect, useRef, type FormEvent, type ReactNode, type Ref } from "react";

/**
 * A dialog on the browser's own `<dialog>`, opened with `showModal`, so it sits in the top
 * layer, holds the focus inside itself and gives it back on closing without any help. Escape
 * and a press on the veil around it close it; on a phone it rises from the bottom edge.
 *
 * It is controlled: `open` says whether it is up and `onOpenChange(false)` asks to close it.
 * `title` and `description` head it, the children are its body, and `foot` holds its actions.
 * With `onSubmit` the body and the foot are one form, so Enter in a field submits it. A list
 * opened inside it (a `Select`, a `Menu`) opens in the top layer above it. `still` holds a
 * phone's sheet at its full height, for a dialog whose content arrives after it opens. `bare`
 * puts the children straight into the frame under the head, for a caller that lays out its
 * own body and foot; `ref` is the `<dialog>` itself. `problem` is a refusal the form came back
 * with, said at the foot's start beside the action that met it (`FootProblem`), so the body
 * above it never moves when it comes or goes.
 */
export function Dialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  foot?: ReactNode;
  problem?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  size?: "sm" | "lg";
  role?: "dialog" | "alertdialog";
  still?: boolean;
  className?: string;
  bare?: boolean;
  ref?: Ref<HTMLDialogElement>;
}) {
  const id = useId();
  const box = useRef<HTMLDialogElement>(null);
  const pressed = useRef(false);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    if (props.open && !el.open) el.showModal();
    if (!props.open && el.open) el.close();
  }, [props.open]);

  // Closed while still up when it leaves the page, so the top layer lets go of it.
  useLayoutEffect(() => {
    const el = box.current;
    return () => {
      if (el?.open) el.close();
    };
  }, []);

  const classes = ["ui-dialog", props.size ? `ui-dialog-${props.size}` : "", props.still ? "ui-dialog-still" : "", props.className ?? ""].filter(Boolean).join(" ");
  const inner = props.bare ? (
    props.children
  ) : (
    <>
      {props.children ? <div className="ui-dialog-body">{props.children}</div> : null}
      {props.foot ? (
        <div className="ui-dialog-foot">
          <FootProblem>{props.problem}</FootProblem>
          {props.foot}
        </div>
      ) : null}
    </>
  );

  return (
    <dialog
      ref={(el) => {
        box.current = el;
        if (typeof props.ref === "function") props.ref(el);
        else if (props.ref) (props.ref as { current: HTMLDialogElement | null }).current = el;
      }}
      className={classes}
      role={props.role === "alertdialog" ? "alertdialog" : undefined}
      aria-labelledby={`${id}-title`}
      aria-describedby={props.description ? `${id}-description` : undefined}
      // The browser's own close on Escape is turned into a request, so `open` stays the truth.
      onCancel={(event) => {
        event.preventDefault();
        props.onOpenChange(false);
      }}
      // A press on the veil reaches the dialog itself, since its frame fills every pixel of it.
      onPointerDown={(event) => {
        pressed.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressed.current && event.target === event.currentTarget) props.onOpenChange(false);
        pressed.current = false;
      }}
    >
      {props.open ? (
        <div className="ui-dialog-frame">
          <header className="ui-dialog-head">
            <h2 id={`${id}-title`} className="ui-dialog-title">
              {props.title}
            </h2>
            {props.description ? (
              <p id={`${id}-description`} className="ui-dialog-description">
                {props.description}
              </p>
            ) : null}
          </header>
          {props.onSubmit ? (
            <form className="ui-dialog-form" onSubmit={props.onSubmit}>
              {inner}
            </form>
          ) : (
            inner
          )}
        </div>
      ) : null}
    </dialog>
  );
}

/**
 * A refusal in a dialog's foot: at its start, in the danger ink, announced, on the row of the
 * buttons it answers, so it takes no room above them. Nothing is drawn while there is none.
 */
export function FootProblem(props: { children?: ReactNode }) {
  return props.children ? (
    <p className="ui-dialog-problem" role="alert">
      {props.children}
    </p>
  ) : null;
}
