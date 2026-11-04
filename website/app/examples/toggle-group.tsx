// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { TextBIcon as Bold, TextItalicIcon as Italic, UnderlineIcon as Underline } from "vic-ui/icons"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "vic-ui/ui"

export function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" multiple>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default ToggleGroupDemo
