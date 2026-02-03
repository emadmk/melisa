'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const validImages = images.filter(Boolean)
  const currentImage = validImages[selectedIndex] || '/images/placeholder.png'

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={getImageUrl(currentImage)}
          alt={title}
          fill
          className="object-contain p-8"
          priority
        />
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Image
                src={getImageUrl(image)}
                alt={`${title} - تصویر ${index + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
