import { useId, type ReactNode } from "react";

/**
 * How far something has got: its words, how far in words, and a bar under them. `value` runs
 * to `max` (100 unless given); left out, the bar says only that it is under way. `valueText`
 * is the words for how far (`"3 of 8 files"`), the percentage where none is given. A `tone`
 * colours the bar, and the words beside it say the state, so the colour never says it alone.
 */
export function Progress(props: {
  label: ReactNode;
  value?: number;
  max?: number;
  valueText?: string;
  tone?: "danger" | "caution" | "settled" | "moving";
  size?: "sm";
  className?: string;
}) {
  const id = useId();
  const max = props.max ?? 100;
  const known = props.value !== undefined;
  const share = known ? Math.min(1, Math.max(0, props.value! / max)) : 0;
  const words = props.valueText ?? (known ? `${Math.round(share * 100)}%` : undefined);
  const classes = ["ui-progress", props.size === "sm" ? "ui-progress-sm" : "", props.className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={classes} data-tone={props.tone}>
      <div className="ui-progress-head">
        <span id={`${id}-label`} className="ui-progress-label">
          {props.label}
        </span>
        {words ? <span className="ui-progress-value">{words}</span> : null}
      </div>
      <div
        className="ui-progress-track"
        role="progressbar"
        aria-labelledby={`${id}-label`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={known ? props.value : undefined}
        aria-valuetext={words}
        data-unknown={known ? undefined : ""}
      >
        <span className="ui-progress-fill" style={known ? { width: `${share * 100}%` } : undefined} />
      </div>
    </div>
  );
}
