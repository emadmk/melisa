'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackSearch } from '@/lib/analytics'

interface SearchBoxProps {
  className?: string
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBox({
  className,
  placeholder = 'جستجو در محصولات...',
  autoFocus = false,
}: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      trackSearch(query)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative flex items-center',
        className
      )}
    >
      <div className="relative w-full">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full pr-10 pl-10 py-2.5 text-dark bg-gray-100 border border-transparent rounded-lg',
            'focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20',
            'placeholder:text-gray-400 transition-all'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}
