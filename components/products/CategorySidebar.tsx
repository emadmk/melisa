'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  nameFa: string
  slug: string
  count?: number
}

interface CategorySidebarProps {
  categories: Category[]
  currentSlug?: string
  locale?: 'en' | 'ar'
}

export default function CategorySidebar({ categories, currentSlug, locale = 'en' }: CategorySidebarProps) {
  const pathname = usePathname()
  const isArabic = locale === 'ar'
  const basePath = isArabic ? '/ar/products/category' : '/products/category'

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-bold text-lg text-dark mb-4 flex items-center gap-2">
        <ChevronLeft className={cn('w-5 h-5 text-primary', isArabic && 'rotate-180')} />
        {isArabic ? 'فئات المنتجات' : 'Product Categories'}
      </h3>

      <ul className="space-y-2">
        {categories.map((category) => {
          const isActive = currentSlug === category.slug || pathname.includes(category.slug)

          return (
            <li key={category.id}>
              <Link
                href={`${basePath}/${category.slug}`}
                className={cn(
                  'flex items-center justify-between py-2 px-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-orange-50 text-primary font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                )}
              >
                <span>{category.nameFa}</span>
                {category.count !== undefined && (
                  <span className="text-sm text-gray-400">({category.count})</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
