// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
"use client"

import * as React from "react"

import { Calendar } from "vic-ui/ui"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-(--radius-control) border"
      captionLayout="dropdown"
    />
  )
}
