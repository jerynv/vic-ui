import { forwardRef, type ComponentProps } from "react";
import { Button } from "./Button";

type Props = ComponentProps<typeof Button>;

/**
 * The commit of something that removes or ends, filled in the danger ink, on the library's button: its sizes, its focus ring and its words. `look="line"`
 * is the way in to such an act, outlined in the danger edge with its words in the danger ink,
 * and `look="quiet"` the words alone in it, for a row's Void or Refund.
 */
export const DangerButton = forwardRef<HTMLButtonElement, Props>(function DangerButton({ className, look = "ink", ...rest }, ref) {
  const tone = look === "ink" ? "ui-button-danger" : look === "line" ? "ui-button-danger-line" : "ui-button-danger-quiet";
  return <Button ref={ref} look={look} className={className ? `${tone} ${className}` : tone} {...rest} />;
});

/** The commit of a change to terms somebody agreed to, filled in the caution ink. */
export const CautionButton = forwardRef<HTMLButtonElement, Omit<Props, "look">>(function CautionButton({ className, ...rest }, ref) {
  return <Button ref={ref} look="ink" className={className ? `ui-button-caution ${className}` : "ui-button-caution"} {...rest} />;
});
