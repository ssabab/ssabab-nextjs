"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { ko } from "date-fns/locale"
import axios from "axios"

export default function CalendarSelector({
  onMenuCheckResult,
}: {
  onMenuCheckResult: (date: string, menus: any[]) => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const handleSelect = async (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)

    const formatted = date.toLocaleDateString("sv-SE") // YYYY-MM-DD

    try {
      const res = await axios.get(`/api/menu?date=${formatted}`)
      onMenuCheckResult(formatted, res.data)
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 404) {
        onMenuCheckResult(formatted, [])
      } else {
        console.error("메뉴 조회 중 오류 발생:", err)
        alert("메뉴 정보를 불러오는 중 문제가 발생했습니다.")
      }
    }
  }

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      locale={ko}
    />
  )
}
