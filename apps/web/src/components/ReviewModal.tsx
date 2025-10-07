'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import ReviewForm, { ReviewFormData } from './ReviewForm'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderNumber: string
  sellerName: string
  onSuccess: () => void
}

export default function ReviewModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  sellerName,
  onSuccess,
}: ReviewModalProps) {
  if (!isOpen) return null

  const handleSubmit = async (reviewData: ReviewFormData) => {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Errore durante l\'invio della recensione')
    }

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Lascia una Recensione</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <ReviewForm
              orderId={orderId}
              orderNumber={orderNumber}
              sellerName={sellerName}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
