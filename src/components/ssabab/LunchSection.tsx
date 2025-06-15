'use client'

import { useState, useEffect, useCallback } from "react"
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
  date: string; // date 속성 추가
  foods: FoodItem[]
}

// API 응답 전체 구조를 위한 인터페이스 추가
interface ApiResponse {
  menus: Menu[];
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

  const handleDateChange = useCallback((dateString: string) => {
    setSelectedDate(new Date(dateString))
  }, [])

  // 메뉴 데이터 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const dateStr = formatDateForAPI(selectedDate)
        // API 응답 전체 구조를 ApiResponse 타입으로 받습니다.
        const res = await axios.get<ApiResponse>(
          `http://localhost:8080/api/menu?date=${dateStr}`
        )
        // 실제 메뉴 데이터는 res.data.menus 안에 있으므로 이를 설정합니다.
        // 그리고 res.data.menus가 배열인지 한 번 더 확인하여 안정성을 높입니다.
        if (res.data && Array.isArray(res.data.menus)) {
          setMenuData(res.data.menus)
        } else {
          console.warn("API 응답에 'menus' 배열이 없거나 유효하지 않습니다:", res.data);
          setMenuData([]); // 데이터가 없으면 빈 배열로 초기화
        }
      } catch (err) {
        console.error("메뉴 로딩 실패:", err)
        setMenuData([]); // 에러 발생 시 빈 배열로 초기화
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

      <WeekBar onDateChange={handleDateChange} />

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