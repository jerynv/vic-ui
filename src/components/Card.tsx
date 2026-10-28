import type { HTMLAttributes, ReactNode } from "react";

/**
 * The one surface on the page: `lifted` sits on the page on the lifted surface with a hairline
 * and no shadow, as every surface on the page has (`--edge`), `recessed` sinks into it on the
 * fields' fill, and `tone="danger"` draws the hairline in the danger edge, for a danger zone. A
 * head (`title`, a `description` under it and `actions` at its end) and a `foot` are drawn only
 * when given. `plain` puts the children in the card itself, padded, for a card that lays them
 * out (a grid of fields, a form), and `flush` gives the body no padding, for rows that run to
 * the card's edges. `as` draws it as a section or as the form it is.
 */
export function Card(
  props: Omit<HTMLAttributes<HTMLElement>, "title"> & {
    as?: "div" | "section" | "form";
    look?: "lifted" | "recessed";
    tone?: "danger" | undefined;
    plain?: boolean;
    flush?: boolean;
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    foot?: ReactNode;
    children?: ReactNode;
  },
) {
  const { as: As = "div", look = "lifted", tone, plain, flush, title, description, actions, foot, className, children, ...rest } = props;
  const classes = ["ui-card", `ui-card-${look}`, plain ? "ui-card-plain" : "", className ?? ""].filter(Boolean).join(" ");
  if (plain) {
    return (
      <As className={classes} data-tone={tone} {...rest}>
        {children}
      </As>
    );
  }
  return (
    <As className={classes} data-tone={tone} {...rest}>
      {title || description || actions ? (
        <div className="ui-card-head">
          <div className="ui-card-heading">
            {title ? <h3 className="ui-card-title">{title}</h3> : null}
            {description ? <p className="ui-card-description">{description}</p> : null}
          </div>
          {actions ? <div className="ui-card-actions">{actions}</div> : null}
        </div>
      ) : null}
      {children !== undefined && children !== null ? <div className={flush ? "ui-card-body ui-card-flush" : "ui-card-body"}>{children}</div> : null}
      {foot ? <div className="ui-card-foot">{foot}</div> : null}
    </As>
  );
}
