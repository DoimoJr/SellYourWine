'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => {
        const filled = value <= rating
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            {filled ? (
              <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
            ) : (
              <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
            )}
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
