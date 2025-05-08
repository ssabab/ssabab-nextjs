import { RatingForm } from '@/components/review/RatingForm'

const menuA = [
  "미역국", "열무보리비빔밥", "계란후라이",
  "소떡꼬치구이&양념치킨소스", "소스", "두부조림", "포기김치"
]

export default function ReviewPageA() {
  return <RatingForm title="식단 A" items={menuA} />
}
