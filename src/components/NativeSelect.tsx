import { forwardRef, type SelectHTMLAttributes } from "react";

/** A native select for forms that need the platform picker and ordinary option children.
 * Uses the same field surface as TextField; label it with a label or aria-label.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function NativeSelect({ className, ...props }, ref) {
    return <select {...props} ref={ref} className={["ui-native-select", className].filter(Boolean).join(" ")} />;
  },
);
