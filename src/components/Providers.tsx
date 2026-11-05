import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { BRAND_MARKS } from "./focus-support/brand-marks";
import { Button } from "./Button";

/** Portable identities represented by the source's own provider marks. No database type is imported. */
export type ProviderKind = keyof typeof BRAND_MARKS;
export interface ProviderButtonsProps {
  providers: readonly ProviderKind[];
  verb: string;
  onChoose: (provider: ProviderKind) => void;
  inline?: { size?: "sm" } | undefined;
  disabled?: boolean | undefined;
}
function Buttons({ onTrigger, ...props }: ProviderButtonsProps & { onTrigger?: ((button: HTMLButtonElement) => void) | undefined }) {
  return <>{props.providers.map(one => {
    const { label, Mark } = BRAND_MARKS[one];
    return <Button key={one} type="button" look="line" disabled={props.disabled} {...(props.inline ? {} : { className: "ui-provider-button" })} data-provider={one} onClick={event => {
      if (props.disabled) return;
      onTrigger?.(event.currentTarget); props.onChoose(one);
    }}><Mark size={props.inline ? 14 : 17} />{props.verb} {label}</Button>;
  })}</>;
}

/** Provider selection only. The host owns any authorization, form submission or navigation. */
export function ProviderButtons(props: ProviderButtonsProps) { return <Buttons {...props} />; }

export interface ProviderChoiceProps extends ProviderButtonsProps {
  /** Always mounted in the same grid cell, reserving the notice's height before it opens. */
  notice?: ReactNode;
  showNotice?: boolean | undefined;
  noticeLabel?: string | undefined;
  noticeFocusRef?: RefObject<HTMLElement | null> | undefined;
  separator?: ReactNode;
}

/** Controlled provider/notice composition, without provider-specific advice, countdowns or automatic submission. */
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
