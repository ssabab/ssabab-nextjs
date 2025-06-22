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
      const res = await axios.get(`http://localhost:8080/api/menu?date=${formatted}`)

      const raw = res.data
      const menus: any[] = []

      if (raw.menu1) {
        menus.push({
          menuId: 1,
          date: raw.date,
          foods: raw.menu1.foods,
        })
      }

      if (raw.menu2) {
        menus.push({
          menuId: 2,
          date: raw.date,
          foods: raw.menu2.foods,
        })
      }

      onMenuCheckResult(formatted, menus)
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
