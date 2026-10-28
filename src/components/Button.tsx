import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "./Link";
import { useBlocked } from "./reason";

/**
 * The library's button. `ink` is a page's one filled action, `line` an outlined one beside
 * it, and `quiet` words that act; `lg` is the height of a form's commit. A native button, so
 * a form submits with it, the keyboard reaches it and a screen reader names it by its words.
 *
 * Built as Cult UI's Texture Button is (MIT, nolly-studio/cult-ui, `texture-button.tsx`): the
 * button is a rim, a hairline border round a gradient one pixel deep, and its words sit on a
 * face inside it (`ui-button-face`) with a gradient of its own, so the edge reads as light on
 * a bevel rather than a drawn border. The colours are the palette's (`--rim-*`, `--face-*` in
 * `tokens.css`).
 *
 * `disabledReason` keeps a button that cannot be pressed yet in reach and says why on hover and
 * focus (`useBlocked` in `reason.ts`), rather than leaving a greyed shape nobody can ask about.
 * `square` draws an icon alone as wide as the button is tall; its words are its `aria-label`.
 * `round` makes it a circle, as a message box's Send is.
 */
export type ButtonLook = "ink" | "line" | "quiet";

function classes(look: ButtonLook, size: "md" | "lg", full?: boolean, extra?: string, square?: boolean, round?: boolean): string {
  return ["ui-button", `ui-button-${look}`, size === "lg" ? "ui-button-lg" : "", full ? "ui-button-full" : "", square ? "ui-button-square" : "", round ? "ui-button-round" : "", extra ?? ""].filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { look?: ButtonLook; size?: "md" | "lg"; full?: boolean; square?: boolean; round?: boolean; icon?: ReactNode; disabledReason?: string | undefined }>(function Button(
  { look = "ink", size = "md", full, square, round, icon, className, children, type = "button", disabled, disabledReason, ...rest },
  ref,
) {
  const held = useBlocked(disabled, disabledReason, ref);
  return (
    <>
      <button type={type} className={classes(look, size, full, className, square, round)} {...rest} {...held.props}>
        <span className="ui-button-face">
          {icon}
          {children}
        </span>
      </button>
      {held.node}
    </>
  );
});

/**
 * The same looks on a link: to a page of this app by `to` (with `state` handed to it), or
 * anywhere else by `href`. Every
 * other attribute of a link passes through (`aria-label`, `tabIndex`); `icon` comes before the
 * words, and `square` draws the icon alone, its words in `aria-label`.
 */
export function ButtonLink(
  props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to?: string; state?: unknown; href?: string; look?: ButtonLook; size?: "md" | "lg"; full?: boolean; square?: boolean; icon?: ReactNode; newTab?: boolean; children?: ReactNode },
) {
  const { to, state, href, look, size, full, square, icon, newTab, className: extra, children, ...rest } = props;
  const className = classes(look ?? "ink", size ?? "md", full, extra, square);
  const face = (
    <span className="ui-button-face">
      {icon}
      {children}
    </span>
  );
  return to ? (
    <Link to={to} state={state} className={className} {...rest}>
      {face}
    </Link>
  ) : (
    <a href={href} className={className} {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
      {face}
    </a>
  );
}
