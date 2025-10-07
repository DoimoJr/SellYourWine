'use client'

import { UserIcon } from '@heroicons/react/24/outline'
import RatingStars from './RatingStars'

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    comment?: string
    communicationRating?: number
    shippingRating?: number
    packagingRating?: number
    sellerResponse?: string
    sellerRespondedAt?: Date | string
    createdAt: Date | string
    reviewer: {
      id: string
      username: string
      firstName?: string
      lastName?: string
      avatar?: string
    }
  }
  showDetailedRatings?: boolean
}

export default function ReviewCard({ review, showDetailedRatings = true }: ReviewCardProps) {
  const reviewerName = review.reviewer.firstName && review.reviewer.lastName
    ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
    : review.reviewer.username

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {review.reviewer.avatar ? (
            <img
              src={review.reviewer.avatar}
              alt={reviewerName}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{reviewerName}</p>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} size="sm" />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700">{review.comment}</p>
      )}

      {/* Detailed Ratings */}
      {showDetailedRatings && (review.communicationRating || review.shippingRating || review.packagingRating) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
          {review.communicationRating && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Comunicazione</p>
              <RatingStars rating={review.communicationRating} size="sm" />
            </div>
          )}
          {review.shippingRating && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Spedizione</p>
              <RatingStars rating={review.shippingRating} size="sm" />
            </div>
          )}
          {review.packagingRating && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Imballaggio</p>
              <RatingStars rating={review.packagingRating} size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Seller Response */}
      {review.sellerResponse && (
        <div className="bg-gray-50 rounded-md p-3 mt-3">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Risposta del venditore
          </p>
          <p className="text-sm text-gray-700">{review.sellerResponse}</p>
          {review.sellerRespondedAt && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(review.sellerRespondedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
