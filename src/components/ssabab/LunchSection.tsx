'use client'

import { useState, useEffect, useCallback } from "react" // useCallback을 import 합니다.
import axios from "axios"
import WeekBar from "@/components/ssabab/WeekBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'

interface MenuApiResponse {
  menus: Menu[]; // 백엔드 응답의 'menus' 키가 Menu 타입의 배열임을 명시
}



interface Menu {
  menuId: number
  foods: FoodItem[]
}

interface FoodItem {
  foodId: number
  foodName: string
  mainSub: string
  category: string
  tag: string
}

export default function LunchSection() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [menuData, setMenuData] = useState<Menu[]>([])
  const router = useRouter()

  const formatDateForAPI = (date: Date) => {
    // getTimezoneOffset()은 분 단위이므로 60000(밀리초)를 곱하여 밀리초로 변환
    const tzOffset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - tzOffset)
    return localDate.toISOString().slice(0, 10)
  }

  // WeekBar로부터 날짜 변경 이벤트를 받을 핸들러 함수
  // 💡 useCallback을 사용하여 이 함수가 불필요하게 재생성되지 않도록 합니다.
  const handleDateChange = useCallback((dateString: string) => {
    setSelectedDate(new Date(dateString))
  }, []) // 의존성 배열을 비워두어 컴포넌트 마운트 시 한 번만 생성되도록 합니다.
        // setSelectedDate는 React의 setState 함수이므로 의존성으로 넣지 않아도 안정적입니다.


// 메뉴 데이터 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const dateStr = formatDateForAPI(selectedDate)
        // 💡 axios.get의 제네릭 타입을 MenuApiResponse로 지정합니다.
        const res = await axios.get<MenuApiResponse>(
          `http://localhost:8080/api/menu?date=${dateStr}`
        )

        // 💡 res.data.menus를 사용하여 실제 메뉴 배열을 추출하여 setMenuData에 전달합니다.
        if (res.data && Array.isArray(res.data.menus)) {
          setMenuData(res.data.menus) // ✅ 여기가 핵심! res.data.menus를 할당
        } else {
          console.warn("API 응답이 예상된 객체.menus[] 형식이 아닙니다:", res.data)
          setMenuData([]) // 예상과 다르면 빈 배열로 초기화
        }
      } catch (err) {
        console.error("메뉴 로딩 실패:", err)
        setMenuData([])
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
      {/* 💡 useCallback으로 감싼 handleDateChange 함수를 prop으로 전달합니다. */}
      <WeekBar onDateChange={handleDateChange} />

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