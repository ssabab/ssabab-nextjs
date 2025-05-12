'use client'

import { useState } from "react"
import SharedCalendar from "@/components/common/Calendar"

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-6 max-w-md mx-auto">
      <p className="mb-4 text-center">
        선택한 날짜: {selectedDate?.toISOString().slice(0, 10) || "없음"}
      </p>
      <SharedCalendar selected={selectedDate} onSelect={setSelectedDate} />
    </div>
  )
}
