import type { HTMLAttributes, ReactNode } from "react";

/** A page-level heading with optional supporting copy and caller-owned actions. */
export function WorkspaceHeader({ title, description, action, className, ...props }: Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return <header className={["ui-workspace-header", className].filter(Boolean).join(" ")} {...props}>
    <div className="ui-workspace-header-copy"><h1>{title}</h1>{description != null && <p>{description}</p>}</div>
    {action != null && <div className="ui-workspace-header-action">{action}</div>}
  </header>;
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

/** A semantic list of headline measures. Formatting, units, and data remain caller-owned. */
export function MetricSummary({ items, label = "Summary metrics", className, ...props }: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  items: readonly MetricSummaryItem[];
  label?: string;
}) {
  return <section aria-label={label} className={["ui-metric-summary", className].filter(Boolean).join(" ")} {...props}>
    <dl>{items.map((item, index) => <div className="ui-metric-summary-item" key={index}>
      <dt>{item.label}</dt><dd>{item.value}</dd>
      {item.description != null && <div className="ui-metric-summary-description">{item.description}</div>}
      {item.action != null && <div className="ui-metric-summary-action">{item.action}</div>}
    </div>)}</dl>
  </section>;
}
