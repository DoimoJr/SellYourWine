'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
  CalendarIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon,
  XCircleIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import Navbar from '../../components/Navbar'
import ReviewModal from '../../components/ReviewModal'
import { OrderStatus } from '@wine-marketplace/shared'

interface OrderItem {
  id: string
  quantity: number
  price: number
  wine: {
    id: string
    title: string
    imageUrl?: string
    annata: number
  }
}

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
  sellerResponse?: string
  sellerRespondedAt?: string
}

interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  shippingCost?: number
  createdAt: string
  deliveredAt?: string
  trackingNumber?: string
  seller: {
    id: string
    username: string
    firstName?: string
    lastName?: string
  }
  items: OrderItem[]
  hasReview?: boolean
  reviews?: Review[]
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'PROCESSING':
      return 'bg-purple-100 text-purple-800'
    case 'SHIPPED':
      return 'bg-indigo-100 text-indigo-800'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'DISPUTED':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return <ClockIcon className="h-4 w-4" />
    case 'CONFIRMED':
    case 'PAID':
      return <CheckCircleIcon className="h-4 w-4" />
    case 'PROCESSING':
      return <ClockIcon className="h-4 w-4" />
    case 'SHIPPED':
      return <TruckIcon className="h-4 w-4" />
    case 'DELIVERED':
      return <CheckCircleIcon className="h-4 w-4" />
    case 'CANCELLED':
      return <XCircleIcon className="h-4 w-4" />
    default:
      return <ClockIcon className="h-4 w-4" />
  }
}

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'In Attesa'
    case 'CONFIRMED':
      return 'Confermato'
    case 'PAID':
      return 'Pagato'
    case 'PROCESSING':
      return 'In Preparazione'
    case 'SHIPPED':
      return 'Spedito'
    case 'DELIVERED':
      return 'Consegnato'
    case 'CANCELLED':
      return 'Cancellato'
    case 'DISPUTED':
      return 'In Disputa'
    default:
      return status
  }
}

const OrderCard = ({
  order,
  isVendor,
  confirmingDelivery,
  onConfirmDelivery,
  onOpenReviewModal
}: {
  order: Order
  isVendor: boolean
  confirmingDelivery: string | null
  onConfirmDelivery: (orderId: string) => void
  onOpenReviewModal: (order: Order) => void
}) => {
  const [showReview, setShowReview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editRating, setEditRating] = useState(0)
  const [editComment, setEditComment] = useState('')
  const [saving, setSaving] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const handleEditClick = () => {
    if (order.reviews && order.reviews[0]) {
      setEditRating(order.reviews[0].rating)
      setEditComment(order.reviews[0].comment || '')
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditRating(0)
    setEditComment('')
  }

  const handleSaveEdit = async () => {
    if (!order.reviews || !order.reviews[0]) return

    setSaving(true)
    try {
      const response = await fetch(`/api/reviews/${order.reviews[0].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Error response:', errorData)
        throw new Error(errorData.message || errorData.error || 'Failed to update review')
      }

      // Refresh the page to show updated review
      window.location.reload()
    } catch (error) {
      console.error('Error updating review:', error)
      alert(`Errore durante l'aggiornamento della recensione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
    } finally {
      setSaving(false)
    }
  }

  const mainWine = order.orderItems?.[0]?.wine
  const totalItems = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const isReviewEdited = order.reviews?.[0] && new Date(order.reviews[0].updatedAt).getTime() > new Date(order.reviews[0].createdAt).getTime() + 1000

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Order Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ordine #{order.orderNumber}
              </h3>
              <p className="text-sm text-gray-600">
                da {order.seller.firstName && order.seller.lastName
                  ? `${order.seller.firstName} ${order.seller.lastName}`
                  : order.seller.username}
              </p>
            </div>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{getStatusText(order.status)}</span>
            </div>
          </div>

          {/* Wine Preview */}
          <div className="flex items-center space-x-3 mb-3">
            {mainWine?.imageUrl && (
              <img
                src={mainWine.imageUrl}
                alt={mainWine.title}
                className="h-12 w-12 object-cover rounded-md"
              />
            )}
            <div className="flex-1 min-w-0">
              {mainWine && (
                <p className="text-sm font-medium text-gray-900 truncate">
                  {mainWine.title} {mainWine.annata}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? 'articolo' : 'articoli'}
                {(order.orderItems?.length || 0) > 1 && ` (${order.orderItems?.length} vini diversi)`}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(order.createdAt)}
            </span>
            {order.trackingNumber && (
              <span className="flex items-center">
                <TruckIcon className="h-4 w-4 mr-1" />
                Tracking: {order.trackingNumber}
              </span>
            )}
          </div>
        </div>

        {/* Right Section - Price and Actions */}
        <div className="lg:text-right">
          <div className="mb-3">
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(order.totalAmount)}
            </p>
            {order.shippingCost && (
              <p className="text-sm text-gray-600">
                + {formatPrice(order.shippingCost)} spedizione
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
            <Link
              href={`/orders/${order.id}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Dettagli
            </Link>

            {isVendor && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <Link
                href={`/dashboard/orders/${order.id}/manage`}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-wine-600 hover:bg-wine-700 transition-colors"
              >
                <ClockIcon className="h-4 w-4 mr-2" />
                Gestisci
              </Link>
            )}

            {!isVendor && order.status === 'SHIPPED' && (
              <button
                onClick={() => onConfirmDelivery(order.id)}
                disabled={confirmingDelivery === order.id}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirmingDelivery === order.id ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Confermando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Conferma Consegna
                  </>
                )}
              </button>
            )}

            {order.status === 'SHIPPED' && order.trackingNumber && (
              <a
                href={`#`} // TODO: Link to tracking service
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-wine-700 bg-wine-50 hover:bg-wine-100 transition-colors"
              >
                <TruckIcon className="h-4 w-4 mr-2" />
                Traccia
              </a>
            )}

            {!isVendor && order.status === 'DELIVERED' && (!order.reviews || order.reviews.length === 0) && (
              <button
                onClick={() => onOpenReviewModal(order)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition-colors"
              >
                <StarIcon className="h-4 w-4 mr-2" />
                Lascia Recensione
              </button>
            )}

            {!isVendor && order.reviews && order.reviews.length > 0 && (
              <button
                onClick={() => setShowReview(!showReview)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <StarIcon className="h-4 w-4 mr-2" />
                {showReview ? 'Nascondi Recensione' : 'Vedi la Mia Recensione'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Display */}
      {!isVendor && showReview && order.reviews && order.reviews.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {!isEditing ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">La Tua Recensione</h4>
                  {isReviewEdited && (
                    <span className="text-xs text-gray-500 italic">(modificata)</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < order.reviews![0].rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleEditClick}
                    className="text-sm text-wine-600 hover:text-wine-700 font-medium"
                  >
                    Modifica
                  </button>
                </div>
              </div>

              {order.reviews[0].comment && (
                <p className="text-gray-700 mb-2">{order.reviews[0].comment}</p>
              )}

              <p className="text-xs text-gray-500">
                Recensito il {formatDate(order.reviews[0].createdAt)}
                {isReviewEdited && ` • Modificata il ${formatDate(order.reviews[0].updatedAt)}`}
              </p>

              {order.reviews[0].sellerResponse && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Risposta del Venditore</h5>
                  <p className="text-gray-700 text-sm mb-1">{order.reviews[0].sellerResponse}</p>
                  <p className="text-xs text-gray-500">
                    Risposto il {formatDate(order.reviews[0].sellerRespondedAt!)}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Modifica Recensione</h4>
              </div>

              {/* Rating Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valutazione
                </label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditRating(i + 1)}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`h-8 w-8 ${
                          i < editRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } hover:text-yellow-400 cursor-pointer transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commento (opzionale)
                </label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                  placeholder="Condividi la tua esperienza..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editComment.length}/500 caratteri
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || editRating === 0}
                  className="px-4 py-2 bg-wine-600 text-white rounded-md hover:bg-wine-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Salvando...' : 'Salva Modifiche'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

type OrderType = 'purchases' | 'sales'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [activeTab, setActiveTab] = useState<OrderType>('purchases')
  const [error, setError] = useState<string | null>(null)
  const [confirmingDelivery, setConfirmingDelivery] = useState<string | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const isSuccess = searchParams.get('success') === 'true'

  // Set initial tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'sales' || tabParam === 'purchases') {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login?redirect=/orders')
      return
    }

    fetchOrders()
  }, [session, status, router])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter, activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Errore nel caricamento degli ordini')
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Filtra per tipo di ordine (acquisti vs vendite)
    if (activeTab === 'purchases') {
      // Gli ordini dove l'utente è il buyer (NON è il seller)
      filtered = filtered.filter(order => order.seller && order.seller.id !== session?.user?.id)
    } else {
      // Gli ordini dove l'utente è il seller
      filtered = filtered.filter(order => order.seller && order.seller.id === session?.user?.id)
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.seller.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }

  const handleConfirmDelivery = async (orderId: string) => {
    try {
      setConfirmingDelivery(orderId)

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'DELIVERED' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to confirm delivery')
      }

      // Refresh orders list
      await fetchOrders()
    } catch (error) {
      console.error('Error confirming delivery:', error)
      setError(error instanceof Error ? error.message : 'Errore nella conferma della consegna')
    } finally {
      setConfirmingDelivery(null)
    }
  }

  const handleOpenReviewModal = (order: Order) => {
    setSelectedOrder(order)
    setReviewModalOpen(true)
  }

  const handleReviewSuccess = () => {
    setReviewModalOpen(false)
    setSelectedOrder(null)
    // Refresh orders to update hasReview flag
    fetchOrders()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="cart" />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wine-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="cart" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSuccess ? (
          // Success Message
          <div className="text-center py-16">
            <CheckCircleSolidIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ordine Confermato!
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Il tuo ordine è stato elaborato con successo. Riceverai presto una conferma via email
              con i dettagli di spedizione per ogni venditore.
            </p>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Cosa succede ora?</h3>
              <div className="space-y-3 text-sm text-gray-600 text-left">
                <div className="flex items-start space-x-3">
                  <CreditCardIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>I pagamenti sono stati elaborati</span>
                </div>
                <div className="flex items-start space-x-3">
                  <TruckIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Ogni venditore preparerà la spedizione</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Riceverai i codici di tracking separatamente</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/browse"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-wine-600 hover:bg-wine-700 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Continua a Comprare
              </Link>
              <button
                onClick={() => router.push('/orders')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Vedi i Miei Ordini
              </button>
            </div>
          </div>
        ) : (
          // Orders List
          <div>
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <ShoppingBagIcon className="h-8 w-8 text-wine-600" />
                <h1 className="text-3xl font-bold text-gray-900">I Miei Ordini</h1>
              </div>
              <p className="text-gray-600">
                Visualizza e gestisci i tuoi acquisti e vendite
              </p>
            </div>

            {/* Tabs per Acquisti/Vendite */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('sales')}
                    className={`${
                      activeTab === 'sales'
                        ? 'border-wine-600 text-wine-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Le Mie Vendite
                  </button>
                  <button
                    onClick={() => setActiveTab('purchases')}
                    className={`${
                      activeTab === 'purchases'
                        ? 'border-wine-600 text-wine-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    I Miei Acquisti
                  </button>
                </nav>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder={activeTab === 'purchases'
                        ? "Cerca per numero ordine o venditore..."
                        : "Cerca per numero ordine o acquirente..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-wine-500 focus:border-wine-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="lg:w-48">
                  <div className="relative">
                    <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-wine-500 focus:border-wine-500 appearance-none"
                    >
                      <option value="ALL">Tutti gli Stati</option>
                      <option value="PENDING">In Attesa</option>
                      <option value="CONFIRMED">Confermato</option>
                      <option value="PAID">Pagato</option>
                      <option value="PROCESSING">In Preparazione</option>
                      <option value="SHIPPED">Spedito</option>
                      <option value="DELIVERED">Consegnato</option>
                      <option value="CANCELLED">Cancellato</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'ordine trovato' : 'ordini trovati'}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={fetchOrders}
                      className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
                    >
                      Riprova
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            {filteredOrders.length === 0 && !error ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery || statusFilter !== 'ALL'
                      ? 'Nessun ordine trovato'
                      : activeTab === 'purchases'
                        ? 'Nessun acquisto ancora'
                        : 'Nessuna vendita ancora'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || statusFilter !== 'ALL'
                      ? 'Prova a modificare i filtri di ricerca.'
                      : activeTab === 'purchases'
                        ? 'Quando effettuerai il tuo primo acquisto, lo vedrai qui.'
                        : 'Quando venderai il tuo primo vino, lo vedrai qui.'
                    }
                  </p>
                  {!searchQuery && statusFilter === 'ALL' && activeTab === 'purchases' && (
                    <Link
                      href="/browse"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-wine-600 hover:bg-wine-700 transition-colors"
                    >
                      <ShoppingBagIcon className="h-5 w-5 mr-2" />
                      Sfoglia i Vini
                    </Link>
                  )}
                  {!searchQuery && statusFilter === 'ALL' && activeTab === 'sales' && (
                    <Link
                      href="/sell"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-wine-600 hover:bg-wine-700 transition-colors"
                    >
                      <ShoppingBagIcon className="h-5 w-5 mr-2" />
                      Vendi un Vino
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isVendor={activeTab === 'sales'}
                    confirmingDelivery={confirmingDelivery}
                    onConfirmDelivery={handleConfirmDelivery}
                    onOpenReviewModal={handleOpenReviewModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Review Modal */}
        {selectedOrder && (
          <ReviewModal
            isOpen={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            orderId={selectedOrder.id}
            orderNumber={selectedOrder.orderNumber}
            sellerName={
              selectedOrder.seller.firstName && selectedOrder.seller.lastName
                ? `${selectedOrder.seller.firstName} ${selectedOrder.seller.lastName}`
                : selectedOrder.seller.username
            }
            onSuccess={handleReviewSuccess}
          />
        )}
      </div>
    </div>
  )
}