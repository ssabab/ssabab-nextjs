import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function NoticeSection() {
  // TODO: 실제 공지사항 데이터를 API 혹은 CMS에서 받아와 렌더링할 경우
  // 이 컴포넌트를 async로 바꾸고 fetch를 사용하세요.
  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-base font-medium">공지사항</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        <p>2025.04.27 — SSABAB 버전 1.1.0 출시 예정</p>
      </CardContent>
    </Card>
  )
}
