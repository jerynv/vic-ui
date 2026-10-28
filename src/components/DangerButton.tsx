import { forwardRef, type ComponentProps } from "react";
import { Button, ButtonLink, type ButtonLook } from "./Button";

type Props = ComponentProps<typeof Button>;

function dangerClass(look: ButtonLook, className: string | undefined): string {
  const tone = look === "ink" ? "ui-button-danger" : look === "line" ? "ui-button-danger-line" : "ui-button-danger-quiet";
  return className ? `${tone} ${className}` : tone;
}

/**
 * The commit of something that removes or ends, filled in the danger ink, on the library's
 * button: its sizes, its focus ring and its words. `look="line"`
 * is the way in to such an act, outlined in the danger edge with its words in the danger ink,
 * and `look="quiet"` the words alone in it, for a row's Void or Refund.
 */
export const DangerButton = forwardRef<HTMLButtonElement, Props>(function DangerButton({ className, look = "ink", ...rest }, ref) {
  return <Button ref={ref} look={look} className={dangerClass(look, className)} {...rest} />;
});

/**
 * The way in to a destructive act on a link, outlined in the danger edge with its words in the
 * danger ink (`look="line"`, the default), as a `DangerButton` is: the link to the screen of its
 * own where the act is confirmed.
 */
export function DangerButtonLink(props: ComponentProps<typeof ButtonLink>) {
  const { className, look = "line", ...rest } = props;
  return <ButtonLink look={look} className={dangerClass(look, className)} {...rest} />;
}

/** The commit of a change to terms somebody agreed to, filled in the caution ink. */
export const CautionButton = forwardRef<HTMLButtonElement, Omit<Props, "look">>(function CautionButton({ className, ...rest }, ref) {
  return <Button ref={ref} look="ink" className={className ? `ui-button-caution ${className}` : "ui-button-caution"} {...rest} />;
});
