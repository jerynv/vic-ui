import type { HTMLAttributes, ReactNode } from "react";

export interface TraceWaterfallSpan {
  /** Stable key supplied by the caller; never displayed or interpreted. */
  id: string;
  label: ReactNode;
  detail?: ReactNode;
  /** Start offset from the shared wall-time origin, in milliseconds. */
  offsetMs: number;
  /** Recorded elapsed duration, in milliseconds. */
  durationMs: number;
  /** Optional caller-defined state, such as `ok`, `running`, or `error`. */
  status?: string;
}

/** Renders independently supplied spans against one wall-time extent; concurrent spans overlap. */
export function TraceWaterfall({ spans, extentMs, renderStatus, label = "Trace timing", className, ...props }: Omit<HTMLAttributes<HTMLOListElement>, "children"> & {
  spans: readonly TraceWaterfallSpan[];
  extentMs: number;
  label?: string;
  renderStatus?: (status: string, span: TraceWaterfallSpan) => ReactNode;
}) {
  const extent = Number.isFinite(extentMs) && extentMs > 0 ? extentMs : 0;
  const duration = (ms: number) => `${ms.toLocaleString("en-US")} ms`;
  return <ol aria-label={label} className={["ui-trace-waterfall", className].filter(Boolean).join(" ")} {...props}>
    {spans.map((span) => {
      const valid = Number.isFinite(span.offsetMs) && span.offsetMs >= 0 && Number.isFinite(span.durationMs) && span.durationMs >= 0;
      const left = valid && extent > 0 ? Math.max(0, Math.min(100, span.offsetMs / extent * 100)) : 0;
      const width = valid && extent > 0 ? Math.max(0, Math.min(100 - left, span.durationMs / extent * 100)) : 0;
      return <li className="ui-trace-waterfall-row" key={span.id} data-status={span.status}>
        <div className="ui-trace-waterfall-label"><strong>{span.label}</strong>{span.detail != null && <small>{span.detail}</small>}</div>
        <div className="ui-trace-waterfall-timing">
          <span>{valid ? `${duration(span.durationMs)} · start +${duration(span.offsetMs)}` : "Timing unavailable"}</span>
          {valid && extent > 0 && <div className="ui-trace-waterfall-track" aria-hidden="true"><span style={{ insetInlineStart: `${left}%`, width: `${width}%` }} /></div>}
        </div>
        {span.status != null && <div className="ui-trace-waterfall-status">{renderStatus ? renderStatus(span.status, span) : span.status}</div>}
      </li>;
    })}
  </ol>;
}
