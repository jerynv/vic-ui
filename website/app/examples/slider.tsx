// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { Slider } from "vic-ui/ui"

export function SliderDemo() {
  return (
    <Slider
      aria-label="Volume"
      defaultValue={[75]}
      max={100}
      step={1}
      className="mx-auto w-full max-w-xs"
    />
  )
}

export default SliderDemo
