'use client'

import { useState, useRef } from 'react'
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ImageUploadManagerProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  onNewFiles?: (files: File[]) => void
}

export default function ImageUploadManager({
  images,
  onImagesChange,
  maxImages = 10,
  onNewFiles
}: ImageUploadManagerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      if (onNewFiles) {
        onNewFiles(newFiles)
      }
    }
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)

    setDraggedIndex(index)
    onImagesChange(newImages)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0 && onNewFiles) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
      onNewFiles(newFiles)
    }
  }

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDropZoneDragLeave = () => {
    setIsDragging(false)
  }

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-4">
      {/* Current Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group cursor-move rounded-lg overflow-hidden border-2 ${
                draggedIndex === index ? 'border-wine-600 opacity-50' : 'border-gray-200'
              } hover:border-wine-400 transition-all`}
            >
              <div className="aspect-square relative">
                <Image
                  src={image}
                  alt={`Wine image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-wine-600 text-white text-xs px-2 py-1 rounded">
                    Principale
                  </div>
                )}
              </div>

              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Rimuovi immagine"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs text-center">
                  Trascina per riordinare
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {canAddMore && (
        <div
          onDrop={handleDropZoneDrop}
          onDragOver={handleDropZoneDragOver}
          onDragLeave={handleDropZoneDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-wine-600 bg-wine-50'
              : 'border-gray-300 hover:border-wine-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-gray-100 rounded-full">
              {isDragging ? (
                <ArrowUpTrayIcon className="h-8 w-8 text-wine-600" />
              ) : (
                <PhotoIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-wine-600 hover:text-wine-700 font-medium"
              >
                Carica immagini
              </button>
              <span className="text-gray-500"> o trascina qui</span>
            </div>

            <p className="text-sm text-gray-500">
              {images.length === 0 ? (
                <>Puoi caricare fino a {maxImages} immagini</>
              ) : (
                <>Puoi aggiungere ancora {maxImages - images.length} {maxImages - images.length === 1 ? 'immagine' : 'immagini'}</>
              )}
            </p>

            <p className="text-xs text-gray-400">
              PNG, JPG, GIF fino a 10MB
            </p>
          </div>
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-gray-500 italic text-center">
          La prima immagine caricata sarà quella principale mostrata nelle ricerche
        </p>
      )}
    </div>
  )
}
