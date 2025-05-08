import { useState } from 'react'
import { Star } from 'lucide-react'
import cn from 'classnames'

interface StarRatingProps {
  value: number
  onChange: (val: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          className={cn(
            'w-6 h-6 cursor-pointer transition-colors',
            (hovered ?? value) >= star ? 'text-yellow-400' : 'text-gray-400'
          )}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          fill={(hovered ?? value) >= star ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}