'use client'

import { useState } from 'react'
import RatingStars from './RatingStars'

interface ReviewFormProps {
  orderId: string
  orderNumber: string
  sellerName: string
  onSubmit: (reviewData: ReviewFormData) => Promise<void>
  onCancel: () => void
}

export interface ReviewFormData {
  orderId: string
  rating: number
  comment: string
}

export default function ReviewForm({
  orderId,
  orderNumber,
  sellerName,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Seleziona una valutazione complessiva')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit({
        orderId,
        rating,
        comment,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'invio della recensione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Recensisci il tuo ordine
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Ordine #{orderNumber} • Venditore: {sellerName}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valutazione Complessiva *
        </label>
        <RatingStars
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
        {rating > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {rating === 5 && 'Eccellente!'}
            {rating === 4 && 'Molto buono'}
            {rating === 3 && 'Buono'}
            {rating === 2 && 'Sufficiente'}
            {rating === 1 && 'Scarso'}
          </p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scrivi la tua esperienza (opzionale)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Condividi la tua esperienza con questo ordine..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500 caratteri
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="px-6 py-2 bg-wine-600 text-white rounded-md hover:bg-wine-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Invio...' : 'Invia Recensione'}
        </button>
      </div>
    </form>
  )
}
