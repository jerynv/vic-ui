/**
 * Something is on its way: a small turning arc in the colour of the words around it. Under
 * reduced motion it stands still as the same mark. With `label` it is announced as a status;
 * without one it is decoration beside words that already say what is happening.
 */
export function Spinner(props: { size?: number; label?: string; className?: string }) {
  const size = props.size ?? 16;
  return (
    <svg
      className={props.className ? `ui-spinner ${props.className}` : "ui-spinner"}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      role={props.label ? "status" : undefined}
      aria-label={props.label}
      aria-hidden={props.label ? undefined : true}
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.75" opacity="0.2" />
      <path d="M8 1.75a6.25 6.25 0 0 1 6.25 6.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
