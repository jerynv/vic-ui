// Adapted from shadcn/ui base-nova (MIT), snapshot 8a35366; see THIRD_PARTY_NOTICES.md.
"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  look = "rimmed",
  tone,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
  look?: "flat" | "rimmed"
  tone?: "accent" | undefined
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "ui-switch peer",
        look === "flat" && "ui-switch-flat",
        tone === "accent" && "ui-switch-accent",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="ui-switch-knob"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
