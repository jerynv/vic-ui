// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
"use client"

import { Button } from "vic-ui/ui"
import { toast } from "vic-ui/ui"

export function ToastDemo() {
  function showToast() {
    const id = toast.add({
      title: "Event created",
      description: "Sunday, December 3 at 9:00 AM",
      actionProps: {
        children: "Undo",
        onClick() {
          toast.close(id)
        },
      },
    })
  }

  return (
    <Button variant="outline" onClick={showToast}>
      Show Toast
    </Button>
  )
}

export default ToastDemo
