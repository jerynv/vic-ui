// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import * as React from "react"

import { ScrollArea } from "vic-ui/ui"
import { Separator } from "vic-ui/ui"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-(--radius-row) border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ScrollAreaDemo
