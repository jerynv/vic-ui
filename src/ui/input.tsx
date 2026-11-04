// Adapted from shadcn/ui base-nova (MIT), snapshot 8a35366; see THIRD_PARTY_NOTICES.md.
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="ui-field-box" data-invalid={props["aria-invalid"] && props["aria-invalid"] !== "false" ? "" : undefined}>
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "ui-field-input",
        className
      )}
      {...props}
    />
    </div>
  )
}

export { Input }
