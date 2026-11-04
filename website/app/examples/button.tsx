// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { ArrowUpIcon } from "vic-ui/icons"

import { Button } from "vic-ui/ui"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
