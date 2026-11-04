// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { BookmarkIcon } from "vic-ui/icons"

import { Toggle } from "vic-ui/ui"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <BookmarkIcon className="group-aria-pressed/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  )
}

export default ToggleDemo
