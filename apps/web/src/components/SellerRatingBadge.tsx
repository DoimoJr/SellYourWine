'use client'

import { StarIcon } from '@heroicons/react/24/solid'

interface SellerRatingBadgeProps {
  rating: number
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export default function SellerRatingBadge({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
}: SellerRatingBadgeProps) {
  if (reviewCount === 0) {
    return (
      <span className="text-sm text-gray-500">
        Nessuna recensione
      </span>
    )
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={`flex items-center space-x-1 ${sizeClasses[size]}`}>
      <StarIcon className={`${iconSizes[size]} text-yellow-400`} />
      <span className="font-medium text-gray-900">
        {rating.toFixed(1)}
      </span>
      {showCount && (
        <span className="text-gray-600">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}
