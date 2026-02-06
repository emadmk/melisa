import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { generateBreadcrumbSchema } from '@/lib/seo'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  name?: string
  label?: string
  url?: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
}

export default function Breadcrumb({ items, variant = 'light' }: BreadcrumbProps) {
  const normalizedItems = items.map((item) => ({
    label: item.label || item.name || '',
    href: item.href || item.url || '',
  }))
  const allItems = [{ label: 'Home', href: '/' }, ...normalizedItems]

  const schema = generateBreadcrumbSchema(
    allItems.map((item) => ({
      name: item.label,
      url: `https://melisa.ae${item.href}`,
    }))
  )

  const isDark = variant === 'dark'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-1.5 text-sm">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className={cn(
                  "w-4 h-4 mx-1.5",
                  isDark ? "text-slate-600" : "text-gray-400"
                )} />
              )}
              {index === allItems.length - 1 ? (
                <span className={cn(
                  "font-medium",
                  isDark ? "text-white" : "text-gray-700"
                )}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors flex items-center gap-1.5",
                    isDark
                      ? "text-slate-400 hover:text-primary"
                      : "text-gray-500 hover:text-primary"
                  )}
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
