import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function NoticeSection() {
  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-base font-medium">공지사항</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        {/* TODO: 실제 공지사항 데이터를 API 혹은 CMS에서 받아와서 렌더링 */}
        <p>2025.04.27 — SSABAB 버전 1.1.0 출시 예정</p>
      </CardContent>
    </Card>
  )
}
