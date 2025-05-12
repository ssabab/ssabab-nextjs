'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SectionTitle from "@/components/common/SectionTitle"

interface FoodItem {
  foodId: number
  foodName: string
  mainSub: string
  category: string
  tag: string
}

interface Menu {
  menuId: number
  foods: FoodItem[]
}

export default function LunchSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [menuData, setMenuData] = useState<Menu[]>([])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // API용 날짜: yyyy-mm-dd
  const formatDateForAPI = (date: Date) => date.toISOString().slice(0, 10)

  // 화면 출력용 날짜: yyyy.MM.dd EEE (예: 2025.05.12 Mon)
  const formatDateForDisplay = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" }) // "Mon", "Tue"
    return `${year}.${month}.${day} ${weekday}`
  }

  // 메뉴 API 요청
  useEffect(() => {
    if (!selectedDate) return

    const dateStr = formatDateForAPI(selectedDate)
    axios
      .get<Menu[]>(`http://localhost:8080/menu/${dateStr}`)
      .then((res) => setMenuData(res.data))
      .catch((err) => console.error("메뉴 로딩 실패:", err))
  }, [selectedDate])

  const centerA = menuData.find((menu) => menu.menuId === 1)?.foods || []
  const centerB = menuData.find((menu) => menu.menuId === 2)?.foods || []

  return (
    <section className="space-y-6">
      <SectionTitle title="점심 식단 보기" />

      {/* ✅ 날짜 토글 버튼 */}
      <div>
        <button
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className="border rounded px-3 py-1 text-sm hover:bg-gray-100"
        >
          {selectedDate ? formatDateForDisplay(selectedDate) : "날짜 선택"}
        </button>

        {isCalendarOpen && (
          <div className="mt-2 w-fit">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date)
                  setIsCalendarOpen(false)
                }
              }}
              className="rounded-md border"
            />
          </div>
        )}
      </div>

      {/* ✅ 메뉴 카드 A/B */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* A */}
        <Card className="flex-1 border hover:shadow-md">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-base font-medium text-gray-800">식단 A</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {centerA.map((item) => (
                <li key={item.foodId}>{item.foodName}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1 pt-2">
              <Badge variant="outline">국물 있음</Badge>
              <Badge variant="secondary">매울 수 있음</Badge>
            </div>
          </CardContent>
        </Card>

        {/* B */}
        <Card className="flex-1 border hover:shadow-md">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-base font-medium text-gray-800">식단 B</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {centerB.map((item) => (
                <li key={item.foodId}>{item.foodName}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1 pt-2">
              <Badge variant="outline">국물 없음</Badge>
              <Badge variant="secondary">맵지 않음</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
