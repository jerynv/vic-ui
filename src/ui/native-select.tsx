// Adapted from shadcn/ui base-nova (MIT), snapshot 8a35366; see THIRD_PARTY_NOTICES.md.
import type { SurfaceProps } from "../components/Surface";
import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "@/icons/icons"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & SurfaceProps & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  surface,
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "ui-field-box group/native-select relative w-fit data-[size=sm]:h-(--control-h-sm)",
        className
      )}
      data-slot="native-select-wrapper"
      data-ui-surface={surface}
      data-invalid={props["aria-invalid"] && props["aria-invalid"] !== "false" ? "" : undefined}
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="ui-field-input w-full appearance-none pr-8 text-sm data-[size=sm]:text-xs"
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none" aria-hidden="true" data-slot="native-select-icon" />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
