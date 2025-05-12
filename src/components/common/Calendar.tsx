'use client'

import { Calendar } from "@/components/ui/calendar"

type Props = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
}

export default function SharedCalendar({ selected, onSelect}: Props) {
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      className="rounded-md border"
    />
  )
}