"use client" 

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SectionTitle from "@/components/common/SectionTitle"

// 타입 정의
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
  const [menuData, setMenuData] = useState<Menu[]>([])

  // 고정 날짜: 2025년 5월 7일
  const fixedDate = "2025-05-07"
  const displayDate = "2025년 5월 7일 (수요일)"

  // API 호출
  useEffect(() => {
    fetch(`http://localhost:8080/menu/${fixedDate}`)
      .then((res) => res.json())
      .then((data) => setMenuData(data))
      .catch((err) => console.error("메뉴 로딩 실패:", err))
  }, [])

  // 식단 분리 (menuId로)
  const centerA = menuData.find((menu) => menu.menuId === 1)?.foods || []
  const centerB = menuData.find((menu) => menu.menuId === 2)?.foods || []

  return (
    <section className="space-y-3">
      <p className="text-sm text-gray-500">{displayDate}</p>
      <SectionTitle title="오늘의 점심" />

      <div className="flex flex-col sm:flex-row gap-4">
        {/* 식단 A */}
        <Link href="/review/a" className="flex-1">
          <Card className="h-full hover:shadow-md transition-shadow border border-gray-200 cursor-pointer">
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
        </Link>

        {/* 식단 B */}
        <Link href="/review/b" className="flex-1">
          <Card className="h-full hover:shadow-md transition-shadow border border-gray-200 cursor-pointer">
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
        </Link>
      </div>
    </section>
  )
}
