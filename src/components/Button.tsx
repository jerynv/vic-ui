import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Link } from "./Link";
import { useBlocked } from "./reason";
import { Spinner } from "./Spinner";

/**
 * The library's button. `ink` is a page's one filled action, `line` an outlined one beside
 * it, `quiet` words that act on their own, and `link` words that act inside a sentence; `lg`
 * is the height of a form's commit. A native button, so a form submits with it, the keyboard
 * reaches it and a screen reader names it by its words.
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
 * `round` makes a pill, or a circle together with `square`, as a message box's Send is. `link` is words that act inside a
 * sentence: the sentence's own size and weight, in the strong ink and underlined, wrapping with it.
 * `busy` is `IconButton`'s: the button is `aria-busy` and held while it lasts, and a spinner
 * stands where its icon was, or over its words where it has none, the words kept in place but
 * unseen, so the button keeps its width and nothing beside it moves.
 */
export type ButtonLook = "ink" | "line" | "quiet" | "link";

function classes(look: ButtonLook, size: "md" | "lg", full?: boolean, extra?: string, square?: boolean, round?: boolean, tone?: "accent"): string {
  return ["ui-button", `ui-button-${look}`, tone === "accent" ? "ui-button-accent" : "", size === "lg" ? "ui-button-lg" : "", full ? "ui-button-full" : "", square ? "ui-button-square" : "", round ? "ui-button-round" : "", extra ?? ""].filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { look?: ButtonLook; tone?: "accent" | undefined; size?: "md" | "lg"; full?: boolean; square?: boolean; round?: boolean; icon?: ReactNode; busy?: boolean; disabledReason?: string | undefined; render?: ButtonPrimitive.Props["render"]; nativeButton?: boolean }>(function Button(
  { look = "ink", tone, size = "md", full, square, round, icon, busy, className, children, type = "button", disabled, disabledReason, ...rest },
  ref,
) {
  const held = useBlocked(disabled || busy, disabledReason, ref);
  const over = busy && !icon && children !== undefined && children !== null;
  return (
    <>
      {/* Base UI foundation used by shadcn/ui; preserve vic's public props and face slot. */}
      <ButtonPrimitive type={type} className={classes(look, size, full, className, square, round, tone)} aria-busy={busy || undefined} {...rest} {...held.props}>
        <span className="ui-button-face">
          {busy && !over ? <Spinner /> : icon}
          {over ? <span className="ui-button-busy-words">{children}</span> : children}
          {over ? <Spinner className="ui-button-busy-mark" /> : null}
        </span>
      </ButtonPrimitive>
      {held.node}
    </>
  );
});

/**
 * The same looks on a link: to a page of this app by `to` (with `state` handed to it), or
 * anywhere else by `href`. Every
 * other attribute of a link passes through (`aria-label`, `tabIndex`, a `ref`); `icon` comes
 * before the words, `square` draws the icon alone, its words in `aria-label`, and `round` makes
 * a pill (a circle when combined with `square`).
 */
export function ButtonLink(
  props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to?: string; state?: unknown; href?: string; look?: ButtonLook; tone?: "accent" | undefined; size?: "md" | "lg"; full?: boolean; square?: boolean; round?: boolean; icon?: ReactNode; newTab?: boolean; children?: ReactNode; ref?: Ref<HTMLAnchorElement> },
) {
  const { to, state, href, look, tone, size, full, square, round, icon, newTab, className: extra, children, ...rest } = props;
  const className = classes(look ?? "ink", size ?? "md", full, extra, square, round, tone);
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
