import type { HTMLAttributes, ReactNode } from "react";

/** A page-level heading with optional supporting copy and caller-owned actions. */
export function WorkspaceHeader({ as: Tag = "header", title, description, action, className, ...props }: Omit<HTMLAttributes<HTMLElement>, "title"> & {
  as?: "header" | "div";
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return <Tag className={["ui-workspace-header", className].filter(Boolean).join(" ")} {...props}>
    <div className="ui-workspace-header-copy"><h1 className="ui-workspace-header-title">{title}</h1>{description != null && <p className="ui-workspace-header-description">{description}</p>}</div>
    {action != null && <div className="ui-workspace-header-action">{action}</div>}
  </Tag>;
}

export interface MetricSummaryItem {
  /** Short, human-readable name for the measure. */
  label: ReactNode;
  /** Already formatted by the caller, preserving domain-specific units and precision. */
  value: ReactNode;
  /** Optional context, such as a comparison range or definition. */
  description?: ReactNode;
  /** Optional caller-owned link or action. */
  action?: ReactNode;
}

/**
 * A semantic list of headline measures. Formatting, units, and data remain caller-owned. It sits
 * between two rules on a page; `bare` drops them, and inside a `Card` they are dropped already.
 */
export function MetricSummary({ items, label = "Summary metrics", bare, className, ...props }: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  items: readonly MetricSummaryItem[];
  label?: string;
  bare?: boolean;
}) {
  return <section aria-label={label} data-bare={bare ? "" : undefined} className={["ui-metric-summary", className].filter(Boolean).join(" ")} {...props}>
    <dl>{items.map((item, index) => <div className="ui-metric-summary-item" key={index}>
      <dt>{item.label}</dt><dd><span className="ui-metric-summary-value">{item.value}</span>
        {item.description != null && <div className="ui-metric-summary-description">{item.description}</div>}
        {item.action != null && <div className="ui-metric-summary-action">{item.action}</div>}
      </dd>
    </div>)}</dl>
  </section>;
}
