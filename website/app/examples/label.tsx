// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { Checkbox } from "vic-ui/ui"
import { Label } from "vic-ui/ui"

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
