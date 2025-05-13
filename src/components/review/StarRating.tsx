import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <Star
          key={n}
          className={cn(
            'w-5 h-5 cursor-pointer',
            (hovered ?? value) >= n ? 'text-yellow-400' : 'text-gray-400'
          )}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(n)}
          fill={(hovered ?? value) >= n ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}
