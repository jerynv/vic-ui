// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
"use client"

import * as React from "react"

import { Progress } from "vic-ui/ui"

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}
