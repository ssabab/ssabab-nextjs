'use client'

import { useEffect, useState } from "react"
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
  // 🗓 선택된 날짜 상태 (문자열 형태로 관리)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10) // yyyy-mm-dd
  })

  const [menuData, setMenuData] = useState<Menu[]>([])

  // 📦 API 호출
  useEffect(() => {
    if (!selectedDate) return

    fetch(`http://localhost:8080/menu/${selectedDate}`)
      .then((res) => res.json())
      .then((data) => setMenuData(data))
      .catch((err) => console.error("메뉴 로딩 실패:", err))
  }, [selectedDate])

  // 🍽 A / B 분리
  const centerA = menuData.find((menu) => menu.menuId === 1)?.foods || []
  const centerB = menuData.find((menu) => menu.menuId === 2)?.foods || []

  return (
    <section className="space-y-6">
      <SectionTitle title="점심 식단 보기" />

      {/* ✅ 날짜 선택 input */}
      <div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
      </div>

      {/* ✅ 식단 카드 출력 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 식단 A */}
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

        {/* 식단 B */}
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
