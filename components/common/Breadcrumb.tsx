import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'
import { generateBreadcrumbSchema } from '@/lib/seo'

interface BreadcrumbItem {
  name?: string
  label?: string
  url?: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const normalizedItems = items.map((item) => ({
    label: item.label || item.name || '',
    href: item.href || item.url || '',
  }))
  const allItems = [{ label: 'خانه', href: '/' }, ...normalizedItems]

  const schema = generateBreadcrumbSchema(
    allItems.map((item) => ({
      name: item.label,
      url: `https://hatefertebat.ir${item.href}`,
    }))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronLeft className="w-4 h-4 mx-2 text-gray-400" />
              )}
              {index === allItems.length - 1 ? (
                <span className="text-gray-600 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
