// Adapted from shadcn/ui base-nova (MIT), snapshot 8a35366; see THIRD_PARTY_NOTICES.md.
import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-(--radius-row) bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
