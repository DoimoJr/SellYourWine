'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ImageUploadManager from './ImageUploadManager'

interface Wine {
  id: string
  title: string
  description: string
  price: number
  annata?: number
  region?: string
  country?: string
  producer?: string
  grapeVariety?: string
  alcoholContent?: number
  volume?: number
  wineType: string
  condition: string
  quantity: number
  images: string[]
  status?: string
}

interface EditWineModalProps {
  wine: Wine
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditWineModal({ wine, isOpen, onClose, onSuccess }: EditWineModalProps) {
  const [formData, setFormData] = useState(wine)
  const [images, setImages] = useState<string[]>(wine.images || [])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData(wine)
      setImages(wine.images || [])
      setNewImageFiles([])
      setError(null)
    }
  }, [isOpen, wine])

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImagesChange = (updatedImages: string[]) => {
    setImages(updatedImages)
  }

  const handleNewFiles = (files: File[]) => {
    setNewImageFiles(prev => [...prev, ...files])
    // Create temporary URLs for preview
    const tempUrls = files.map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...tempUrls])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'images' && key !== 'id') {
          submitData.append(key, value.toString())
        }
      })

      // Add existing images (filter out temporary blob URLs)
      images.forEach(img => {
        if (!img.startsWith('blob:')) {
          submitData.append('images', img)
        }
      })

      // Add new image files
      newImageFiles.forEach(file => {
        submitData.append('newImages', file)
      })

      const response = await fetch(`/api/wines/${wine.id}`, {
        method: 'PATCH',
        body: submitData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update wine')
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error updating wine:', err)
      setError(err instanceof Error ? err.message : 'Errore durante l\'aggiornamento')
    } finally {
      setLoading(false)
    }
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
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Modifica Inserzione</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Immagini del Vino
              </label>
              <ImageUploadManager
                images={images}
                onImagesChange={handleImagesChange}
                onNewFiles={handleNewFiles}
                maxImages={10}
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titolo *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prezzo (€) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
              />
            </div>

            {/* Wine Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo di Vino *
                </label>
                <select
                  name="wineType"
                  value={formData.wineType}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                >
                  <option value="RED">Rosso</option>
                  <option value="WHITE">Bianco</option>
                  <option value="ROSE">Rosato</option>
                  <option value="SPARKLING">Spumante</option>
                  <option value="DESSERT">Dessert</option>
                  <option value="FORTIFIED">Liquoroso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condizione *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                >
                  <option value="MINT">Perfetta</option>
                  <option value="EXCELLENT">Eccellente</option>
                  <option value="VERY_GOOD">Molto Buona</option>
                  <option value="GOOD">Buona</option>
                  <option value="FAIR">Discreta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantità *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                />
              </div>
            </div>

            {/* Optional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annata
                </label>
                <input
                  type="number"
                  name="annata"
                  value={formData.annata || ''}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produttore
                </label>
                <input
                  type="text"
                  name="producer"
                  value={formData.producer || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regione
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paese
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-wine-500 focus:border-wine-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-wine-600 text-white rounded-md hover:bg-wine-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
