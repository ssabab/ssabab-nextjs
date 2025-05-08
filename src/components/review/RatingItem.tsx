import { StarRating } from "./StarRating"

interface RatingItemProps {
  name: string
  value: number
  onChange: (value: number) => void
}

export function RatingItem({ name, value, onChange }: RatingItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{name}</span>
      <div className="flex items-center space-x-2">
        <StarRating value={value} onChange={onChange} />
        <span className="text-sm text-gray-600">{value}</span>
      </div>
    </div>
  )
}
