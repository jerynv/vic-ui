// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { Button } from "vic-ui/ui"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "vic-ui/ui"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default TooltipDemo
