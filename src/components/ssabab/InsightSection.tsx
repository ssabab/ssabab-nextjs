import { Card, CardContent } from "@/components/ui/card"
import SectionTitle from "@/components/common/SectionTitle"

const insightText =
  "○○님의 이전 선택과 비교했을 때, 식단 A안을 60% 확률로 더 좋아하실 것 같아요. 최근 5회 중 3회는 국물 있는 메뉴를 선택했어요."

export default function InsightSection() {
  return (
    <section className="space-y-3">
      <SectionTitle title="오늘의 식사 인사이트" />

      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-4 text-sm text-gray-700 leading-relaxed">
          {insightText}
        </CardContent>
      </Card>
    </section>
  )
}
