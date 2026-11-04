import type { SVGProps } from "react";

/**
 * Something is on its way: a small turning arc in the colour of the words around it. Under
 * reduced motion it stands still as the same mark. With `label` it is announced as a status;
 * without one it is decoration beside words that already say what is happening.
 */
export function Spinner(props: SVGProps<SVGSVGElement> & { size?: number; label?: string }) {
  const { size = 16, label, className, ...rest } = props;
  return (
    <svg
      className={className ? `ui-spinner ${className}` : "ui-spinner"}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.75" opacity="0.2" />
      <path d="M8 1.75a6.25 6.25 0 0 1 6.25 6.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
