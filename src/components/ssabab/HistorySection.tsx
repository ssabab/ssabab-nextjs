"use client"

import { Card, CardContent } from "@/components/ui/card"
import SectionTitle from "@/components/common/SectionTitle"

const historyData = [
  {
    date: "4월 28일",
    score: 3.2,
    menu: ["열무보리비빔밥", "두부조림"],
  },
  {
    date: "4월 27일",
    score: 3.5,
    menu: ["눈꽃치즈함박스테이크", "소떡소떡구이&양념치킨소스"],
  },
]

export default function HistorySection() {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <SectionTitle title="최근 나의 선택 기록" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {historyData.map((item, idx) => (
          <Card
            key={idx}
            className="min-w-[200px] flex-shrink-0 border border-gray-200 shadow-sm"
          >
            <CardContent className="p-4 space-y-2 text-sm text-gray-700">
              <div className="font-medium text-gray-800">{item.date}</div>
              <div>⭐ {item.score.toFixed(1)}</div>
              <ul className="list-disc list-inside space-y-1">
                {item.menu.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
