import { RatingItem } from "./RatingItem"

interface RatingListProps {
  items: string[]
  values: number[]
  onChange: (index: number, value: number) => void
}

export function RatingList({ items, values, onChange }: RatingListProps) {
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <RatingItem
          key={item}
          name={item}
          value={values[idx]}
          onChange={(val) => onChange(idx, val)}
        />
      ))}
    </div>
  )
}
