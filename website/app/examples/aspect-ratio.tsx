// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.

import { AspectRatio } from "vic-ui/ui"

export default function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="w-full max-w-sm rounded-(--radius-control) bg-muted">
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        className="h-full w-full rounded-(--radius-control) object-cover grayscale dark:brightness-20"
      />
    </AspectRatio>
  )
}
