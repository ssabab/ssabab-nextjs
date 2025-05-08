import { RatingForm } from '@/components/review/RatingForm'

const menuB = [
  "눈꽃치즈함박스테이크", "검정깨밥",
  "소떡꼬치구이&양념치킨소스", "소스",
  "단호박견포도범벅", "오이피클", "포기김치"
]

export default function ReviewPageB() {
  return <RatingForm title="식단 B" items={menuB} />
}
