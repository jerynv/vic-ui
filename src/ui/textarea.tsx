// Adapted from shadcn/ui base-nova (MIT), snapshot 8a35366; see THIRD_PARTY_NOTICES.md.
import type { SurfaceProps } from "../components/Surface";
import * as React from "react"
import { cn } from "cn"

function Textarea({ className, surface, ...props }: React.ComponentProps<"textarea"> & SurfaceProps) {
  return (
    <div data-ui-surface={surface} className="ui-field-box ui-textarea-box" data-invalid={props["aria-invalid"] && props["aria-invalid"] !== "false" ? "" : undefined}>
    <textarea
      data-slot="textarea"
      className={cn(
        "ui-field-input ui-textarea min-h-16",
        className
      )}
      {...props}
    />
    </div>
  )
}

export { Textarea }
