'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LanguageTabsProps {
  children: (activeTab: 'en' | 'ar') => React.ReactNode
  className?: string
}

export default function LanguageTabs({ children, className }: LanguageTabsProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'en'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          🇬🇧 English
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ar')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'ar'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          🇦🇪 العربية
        </button>
      </div>

      {/* Tab Content */}
      {children(activeTab)}
    </div>
  )
}

// Individual form field with language indicator
interface LocalizedInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  type?: string
  locale: 'en' | 'ar'
}

export function LocalizedInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  locale,
}: LocalizedInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent',
          locale === 'ar' && 'text-right font-arabic'
        )}
      />
    </div>
  )
}

interface LocalizedTextareaProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  rows?: number
  locale: 'en' | 'ar'
}

export function LocalizedTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
  locale,
}: LocalizedTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y',
          locale === 'ar' && 'text-right font-arabic'
        )}
      />
    </div>
  )
}
