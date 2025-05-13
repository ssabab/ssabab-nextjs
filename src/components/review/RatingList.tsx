import { RatingItem } from './RatingItem'

interface Food {
  food_id: number
  food_name: string
}

interface RatingListProps {
  items: Food[]
  values: number[]
  onChange: (index: number, value: number) => void
}

export function RatingList({ items, values, onChange }: RatingListProps) {
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <RatingItem
          key={item.food_id}
          name={item.food_name}
          value={values[idx]}
          onChange={(val) => onChange(idx, val)}
        />
      ))}
    </div>
  )
}
