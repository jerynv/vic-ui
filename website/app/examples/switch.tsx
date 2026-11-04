// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { Label } from "vic-ui/ui"
import { Switch } from "vic-ui/ui"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}

export default SwitchDemo
