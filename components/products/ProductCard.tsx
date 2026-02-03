'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getImageUrl } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    titleFa: string
    titleEn?: string | null
    slug: string
    shortDesc?: string | null
    image?: string | null
    category?: { nameFa: string; slug: string } | null
    brand?: { name: string; slug: string; logo?: string | null } | null
  }
  showCompare?: boolean
  onCompareClick?: (id: string) => void
  isInCompare?: boolean
  className?: string
}

export default function ProductCard({
  product,
  showCompare = true,
  onCompareClick,
  isInCompare = false,
  className,
}: ProductCardProps) {
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onCompareClick?.(product.id)
  }

  return (
    <div
      className={cn(
        'group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-white border-b border-gray-100">
          <Image
            src={getImageUrl(product.image)}
            alt={product.titleFa}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Compare Button */}
          {showCompare && (
            <button
              onClick={handleCompareClick}
              className={cn(
                'absolute top-3 left-3 p-2 rounded-lg transition-all duration-200',
                isInCompare
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-primary hover:text-white opacity-0 group-hover:opacity-100'
              )}
              title={isInCompare ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
            >
              <Scale className="w-4 h-4" />
            </button>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand Logo */}
        {product.brand?.logo && (
          <div className="relative w-12 h-6 mb-2">
            <Image
              src={product.brand.logo}
              alt={product.brand.name}
              fill
              className="object-contain object-right"
              unoptimized
            />
          </div>
        )}

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-dark font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.titleFa}
          </h3>
        </Link>

        {/* Description */}
        {product.shortDesc && (
          <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
            {product.shortDesc}
          </p>
        )}

        {/* CTA Button */}
        <Link
          href={`/products/${product.slug}#inquiry`}
          className="block w-full bg-primary text-white text-center py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors mt-auto"
        >
          درخواست قیمت
        </Link>
      </div>
    </div>
  )
}
