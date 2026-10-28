import type { HTMLAttributes, ReactNode } from "react";

/**
 * A surface with parts: `lifted` sits on the page on the lifted surface with a hairline and
 * no shadow, as every surface on the page has (`--edge`), `recessed` sinks into it on the fields' fill. A head (`title`, a
 * `description` under it and `actions` at its end) and a `foot` are drawn only when given.
 */
export function Card(props: Omit<HTMLAttributes<HTMLDivElement>, "title"> & { look?: "lifted" | "recessed"; title?: ReactNode; description?: ReactNode; actions?: ReactNode; foot?: ReactNode; children?: ReactNode }) {
  const { look = "lifted", title, description, actions, foot, className, children, ...rest } = props;
  return (
    <div className={["ui-card", `ui-card-${look}`, className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {title || description || actions ? (
        <div className="ui-card-head">
          <div className="ui-card-heading">
            {title ? <h3 className="ui-card-title">{title}</h3> : null}
            {description ? <p className="ui-card-description">{description}</p> : null}
          </div>
          {actions ? <div className="ui-card-actions">{actions}</div> : null}
        </div>
      ) : null}
      {children !== undefined && children !== null ? <div className="ui-card-body">{children}</div> : null}
      {foot ? <div className="ui-card-foot">{foot}</div> : null}
    </div>
  );
}
