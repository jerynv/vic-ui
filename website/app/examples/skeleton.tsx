// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { Skeleton } from "vic-ui/ui"

export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-(--radius-round)" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export default SkeletonDemo
