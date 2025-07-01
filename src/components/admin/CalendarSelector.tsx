"use client"

import { useState } from "react"
import { format } from "date-fns"
import api, { Menu } from "@/lib/api"
import { Calendar } from "@/components/ui/calendar"
import { ko } from "date-fns/locale"

interface CalendarSelectorProps {
  onMenuCheckResult: (date: string, menus: Menu[]) => void
}

export default function CalendarSelector({
  onMenuCheckResult,
}: CalendarSelectorProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    setDate(selectedDate)
    const formattedDate = format(selectedDate, "yyyy-MM-dd")

    try {
      const response = await api.get(`/menus/date/${formattedDate}`)
      onMenuCheckResult(formattedDate, response.data)
    } catch (error) {
      console.error("메뉴 조회 실패:", error)
      onMenuCheckResult(formattedDate, [])
    }
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      locale={ko}
      className="rounded-md border"
    />
  )
}
