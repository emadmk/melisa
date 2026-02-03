'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Loader2, ArrowRight, Tag, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResult {
  id: string
  type: 'product' | 'category' | 'post'
  title: string
  slug: string
  image?: string
  category?: string
}

// Mock search function - replace with actual API call
const mockSearch = async (query: string): Promise<SearchResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!query) return []

  const results: SearchResult[] = [
    {
      id: '1',
      type: 'product',
      title: 'صفحه کلید هوشمند استاندارد',
      slug: 'smart-keypad-standard',
      image: '/images/products/keypad.png',
      category: 'کنترل دسترسی',
    },
    {
      id: '2',
      type: 'product',
      title: 'VIDEO INTERCOM READER PRO',
      slug: 'video-intercom-reader-pro',
      image: '/images/products/intercom.png',
      category: 'کنترل دسترسی',
    },
    {
      id: '3',
      type: 'category',
      title: 'دوربین مداربسته',
      slug: 'cctv',
    },
    {
      id: '4',
      type: 'post',
      title: 'راهنمای انتخاب دوربین مداربسته',
      slug: 'choosing-right-cctv',
    },
  ]

  return results.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  )
}

interface SearchAutocompleteProps {
  placeholder?: string
  className?: string
}

export default function SearchAutocomplete({
  placeholder = 'جستجوی محصولات...',
  className = '',
}: SearchAutocompleteProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      const searchResults = await mockSearch(query)
      setResults(searchResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            const result = results[selectedIndex]
            const url =
              result.type === 'product'
                ? `/products/${result.slug}`
                : result.type === 'category'
                ? `/products/category/${result.slug}`
                : `/blog/${result.slug}`
            router.push(url)
            setIsOpen(false)
            setQuery('')
          } else if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
            setIsOpen(false)
          }
          break
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, results, selectedIndex, query, router]
  )

  const getResultUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'product':
        return `/products/${result.slug}`
      case 'category':
        return `/products/category/${result.slug}`
      case 'post':
        return `/blog/${result.slug}`
    }
  }

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'category':
        return <Tag className="w-4 h-4 text-gray-400" />
      case 'post':
        return <FileText className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pr-10 pl-10 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query.trim() || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <>
                <div className="max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <Link
                      key={result.id}
                      href={getResultUrl(result)}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-orange-50' : ''
                      }`}
                    >
                      {result.image ? (
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={result.image}
                            alt={result.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getResultIcon(result.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark truncate">{result.title}</p>
                        {result.category && (
                          <p className="text-xs text-gray-400">{result.category}</p>
                        )}
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            result.type === 'product'
                              ? 'bg-blue-100 text-blue-600'
                              : result.type === 'category'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}
                        >
                          {result.type === 'product'
                            ? 'محصول'
                            : result.type === 'category'
                            ? 'دسته‌بندی'
                            : 'مقاله'}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
                <div className="p-3 border-t bg-gray-50">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    <Search className="w-4 h-4" />
                    مشاهده همه نتایج برای &quot;{query}&quot;
                  </Link>
                </div>
              </>
            ) : query.trim() && !isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-2">نتیجه‌ای یافت نشد</p>
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="text-sm text-primary hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  جستجوی پیشرفته
                </Link>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
