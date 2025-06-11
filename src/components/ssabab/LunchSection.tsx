'use client'

import { useEffect, useState } from "react"
import axios from "axios"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SectionTitle from "@/components/common/SectionTitle"
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
  const [weekOffset, setWeekOffset] = useState<number>(0)  // 주차 오프셋
  const router = useRouter()

  const formatDateForAPI = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - tzOffset)
    return localDate.toISOString().slice(0, 10)
  }

  // 주어진 주차의 월~금 날짜 배열 반환
  const getWeekDates = (offset: number) => {
    const today = new Date()
    const day = today.getDay() // 일=0, 월=1...
    const diffToMonday = (day + 6) % 7
    const monday = new Date(today)
    monday.setHours(0, 0, 0, 0)
    monday.setDate(today.getDate() - diffToMonday + offset * 7)
    const dates: Date[] = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const weekDates = getWeekDates(weekOffset)

  // API 호출
  useEffect(() => {
    const dateStr = formatDateForAPI(selectedDate)
    axios
      .get<Menu[]>(`http://localhost:8080/menu/${dateStr}`)
      .then((res) => setMenuData(res.data))
      .catch((err) => console.error("메뉴 로딩 실패:", err))
  }, [selectedDate])

  const centerA = menuData.find((menu) => menu.menuId%2 === 1)?.foods || []
  const centerB = menuData.find((menu) => menu.menuId%2 === 0)?.foods || []

  return (
    <section className="space-y-6">
      <SectionTitle title="점심 식단 보기" />
      <div className="flex space-x-2 mb-4">
        {weekOffset === 0 ? (
          <button
            onClick={() => setWeekOffset(-1)}
            className="px-3 py-1 border rounded bg-white text-gray-700"
          >
            {'<<'}
          </button>
        ) : (
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1 border rounded bg-white text-gray-700"
          >
            {'>>'}
          </button>
        )}

        {weekDates.map((date) => {
          const label = date.toLocaleDateString('ko-KR', { weekday: 'short' }).charAt(0)
          const isSelected = selectedDate.toDateString() === date.toDateString()
          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={
                `px-3 py-1 border rounded ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* 메뉴 카드 A/B */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* A */}
        <div onClick={() => router.push(`/review/1?date=${formatDateForAPI(selectedDate!)}`)}>
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
        </div>

        {/* B */}
        <div onClick={() => router.push(`/review/2?date=${formatDateForAPI(selectedDate!)}`)}>
          <Card className="flex-1 border hover:shadow-md">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-base font-medium text-gray-800">식단 B</h3>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                {centerA.map((item) => (
                  <li key={item.foodId}>
                    {item.foodName}
                  </li>
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
