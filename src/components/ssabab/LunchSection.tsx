"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SectionTitle from "@/components/common/SectionTitle"

const lunchData = {
  centerA: [
    "미역국",
    "열무보리비빔밥",
    "계란후라이",
    "소떡꼬치구이&양념치킨소스",
    "두부조림",
    "포기김치",
  ],
  centerB: [
    "눈꽃치즈함박스테이크",
    "검정깨밥",
    "소떡꼬치구이&양념치킨소스",
    "단호박건포도범벅",
    "오이피클",
    "포기김치",
  ],
}

export default function LunchSection() {
  return (
    <section className="space-y-3">
      {/* 오늘 날짜 */}
      <p className="text-sm text-gray-500">2025년 4월 29일 화요일</p>

      {/* 섹션 제목 */}
      <SectionTitle title="오늘의 점심" />

      {/* 센터 A & B 카드 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 센터 A */}
        <Card className="flex-1 shadow-sm border border-gray-200">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-base font-medium text-gray-800">식단 A</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {lunchData.centerA.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1 pt-2">
              <Badge variant="outline">국물 있음</Badge>
              <Badge variant="secondary">매울 수 있음</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 센터 B */}
        <Card className="flex-1 shadow-sm border border-gray-200">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-base font-medium text-gray-800">식단 B</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {lunchData.centerB.map((item, idx) => (
                <li key={idx}>{item}</li>
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
