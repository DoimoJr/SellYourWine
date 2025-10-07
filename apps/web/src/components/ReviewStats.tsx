'use client'

import RatingStars from './RatingStars'

interface ReviewStatsProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  responseRate?: number
}

export default function ReviewStats({
  averageRating,
  totalReviews,
  ratingDistribution,
  responseRate,
}: ReviewStatsProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution))

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Valutazioni Cliente
      </h3>

      {/* Overall Rating */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <RatingStars rating={averageRating} size="md" />
          <p className="text-sm text-gray-600 mt-1">
            {totalReviews} {totalReviews === 1 ? 'recensione' : 'recensioni'}
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingDistribution[stars as keyof typeof ratingDistribution] || 0
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

          return (
            <div key={stars} className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 w-8">{stars} ★</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>

      {/* Response Rate */}
      {responseRate !== undefined && responseRate > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tasso di risposta</span>
            <span className="text-sm font-medium text-wine-600">
              {responseRate.toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
