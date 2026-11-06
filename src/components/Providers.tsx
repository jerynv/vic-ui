import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { BRAND_MARKS } from "./focus-support/brand-marks";
import { Button } from "./Button";

/** Portable identities represented by the source's own provider marks. No database type is imported. */
export type ProviderKind = keyof typeof BRAND_MARKS;

interface ProviderButtonsShared {
  providers: readonly ProviderKind[];
  verb: string;
  /** Drawn as the page's own secondary buttons beside the ones around it, rather than the way in's wide ones. */
  inline?: { size?: "sm" } | undefined;
  disabled?: boolean | undefined;
  /** Run just before a provider's form is sent (only with `action`). */
  onLeave?: (() => void) | undefined;
  /**
   * Holds a press back when it answers true (only with `action`), and is handed `go`, which
   * sends that provider's form when the page is ready to: a heads-up before leaving, say.
   */
  hold?: ((provider: ProviderKind, go: () => void) => boolean) | undefined;
}

/**
 * `onChoose` alone: each provider is a plain button and the host does the rest. `action`: each
 * provider is a submit button in its own `<form method="post">` posting to `action(provider)`;
 * `onChoose`, when given too, is told first. At least one of the two is required.
 */
export type ProviderButtonsProps = ProviderButtonsShared &
  (
    | { onChoose: (provider: ProviderKind) => void; action?: ((provider: ProviderKind) => string) | undefined }
    | { action: (provider: ProviderKind) => string; onChoose?: ((provider: ProviderKind) => void) | undefined }
  );

function Buttons({ onTrigger, ...props }: ProviderButtonsProps & { onTrigger?: ((button: HTMLButtonElement) => void) | undefined }) {
  return <>{props.providers.map(one => {
    const { label, Mark } = BRAND_MARKS[one];
    const action = props.action;
    const button = <Button key={one} type={action ? "submit" : "button"} look="line" disabled={props.disabled} {...(props.inline ? {} : { className: "ui-provider-button" })} data-provider={one} onClick={event => {
      // Sent by hand, so a press can be held back and sent later, which only requestSubmit can do.
      if (action) event.preventDefault();
      if (props.disabled) return;
      const pressed = event.currentTarget;
      onTrigger?.(pressed); props.onChoose?.(one);
      if (!action) return;
      const go = () => {
        if (!pressed.isConnected) return;
        props.onLeave?.();
        pressed.form?.requestSubmit(pressed);
      };
      if (props.hold?.(one, go)) return;
      go();
    }}><Mark size={props.inline ? 14 : 17} />{props.verb} {label}</Button>;
    // A form, not a link: a server that writes a row or mints a state on the press is never
    // reached by a preview bot following a link.
    return action ? <form key={one} method="post" action={action(one)} className="ui-provider-form">{button}</form> : button;
  })}</>;
}

/**
 * Provider buttons. Without `action` the host owns authorization, submission and navigation
 * (`onChoose`); with it each posts its own form to the address it gives.
 */
export function ProviderButtons(props: ProviderButtonsProps) { return <Buttons {...props} />; }

export type ProviderChoiceProps = ProviderButtonsProps & {
  /** Always mounted in the same grid cell, reserving the notice's height before it opens. */
  notice?: ReactNode;
  showNotice?: boolean | undefined;
  noticeLabel?: string | undefined;
  noticeFocusRef?: RefObject<HTMLElement | null> | undefined;
  separator?: ReactNode;
};

/** Controlled provider/notice composition, without provider-specific advice or countdowns; `hold` and `notice` compose one. */
export function ProviderChoice({ notice, showNotice = false, noticeLabel = "Provider notice", noticeFocusRef, separator = "or", ...props }: ProviderChoiceProps) {
  const noticeNode = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const wasShown = useRef(false);
  const shown = props.providers.length > 0 && showNotice && notice != null && notice !== false;
  useEffect(() => {
    const restore = wasShown.current && !shown;
    wasShown.current = shown;
    // Inherited visibility may settle a frame after the container changes under
    // the composable stylesheet. Cancel both frames if the controlled state changes.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (shown) (noticeFocusRef?.current ?? noticeNode.current)?.focus();
        else if (restore && lastTrigger.current?.isConnected && !lastTrigger.current.disabled) lastTrigger.current.focus();
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [shown, noticeFocusRef]);
  if (props.providers.length === 0) return null;
  return <div className="ui-providers">
    <div className="ui-providers-stack">
      <div className="ui-providers-buttons" data-hidden={shown ? "" : undefined} inert={shown || undefined} aria-hidden={shown || undefined}>
        <Buttons {...props} onTrigger={button => { lastTrigger.current = button; }} />
      </div>
      {notice != null && notice !== false && <div ref={noticeNode} className="ui-providers-heads" role="group" aria-label={noticeLabel} tabIndex={-1} data-hidden={shown ? undefined : ""} inert={!shown || undefined} aria-hidden={!shown || undefined}>{notice}</div>}
    </div>
    {separator != null && <p className="ui-providers-or"><span>{separator}</span></p>}
  </div>;
}
