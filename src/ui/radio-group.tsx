// Adapted from shadcn/ui base-nova (MIT), snapshot 8a35366; see THIRD_PARTY_NOTICES.md.
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("ui-radios-list", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "ui-radio-dot peer relative",
        className
      )}
      {...props}
    >
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
