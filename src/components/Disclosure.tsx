import type { ComponentProps, ReactNode } from "react";

/** Native disclosure, adapted from Phaethon (MIT). Its summary works without JavaScript. */
export function Disclosure({ summary, children, className, ...props }: ComponentProps<"details"> & { summary: ReactNode }) {
  return (
    <details {...props} className={["ui-disclosure", className].filter(Boolean).join(" ")}>
      <summary className="ui-disclosure-summary">{summary}</summary>
      <div className="ui-disclosure-content">{children}</div>
    </details>
  );
}
