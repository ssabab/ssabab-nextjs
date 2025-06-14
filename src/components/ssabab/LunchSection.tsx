'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import WeekBar from "@/components/ssabab/WeekBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [menuData, setMenuData] = useState<Menu[]>([])
  const router = useRouter()

  const formatDateForAPI = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - tzOffset)
    return localDate.toISOString().slice(0, 10)
  }

  // 메뉴 데이터 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const dateStr = formatDateForAPI(selectedDate)
        const res = await axios.get<Menu[]>(
          `http://localhost:8080/menu/${dateStr}`
        )
        setMenuData(res.data)
      } catch (err) {
        console.error("메뉴 로딩 실패:", err)
      }
    }
    load()
  }, [selectedDate])

  const centerA =
    menuData.find((m) => m.menuId % 2 === 1)?.foods || []
  const centerB =
    menuData.find((m) => m.menuId % 2 === 0)?.foods || []

  return (
    <section className="space-y-6 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold">오늘의 점심 식단 보기</h2>

      {/* WeekBar 컴포넌트로 교체 */}
      <WeekBar onDateChange={(dateString) => setSelectedDate(new Date(dateString))} />

      {/* 메뉴 카드 A/B */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 식단 A */}
        <div
          className="min-w-0"
          onClick={() =>
            router.push(
              `/review/1?date=${formatDateForAPI(selectedDate)}`
            )
          }
        >
          <Card className="flex-1 border hover:shadow-md">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-base font-medium text-gray-800">
                식단 A
              </h3>
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
        </div>

        {/* 식단 B */}
        <div
          className="min-w-0"
          onClick={() =>
            router.push(
              `/review/2?date=${formatDateForAPI(selectedDate)}`
            )
          }
        >
          <Card className="flex-1 border hover:shadow-md">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-base font-medium text-gray-800">
                식단 B
              </h3>
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
      </div>
    </section>
  )
}
