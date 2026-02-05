'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Locale } from './config'
import type { Dictionary } from './dictionaries'

interface LocaleContextType {
  locale: Locale
  dictionary: Dictionary
  isRtl: boolean
}

const LocaleContext = createContext<LocaleContextType | null>(null)

interface LocaleProviderProps {
  children: ReactNode
  locale: Locale
  dictionary: Dictionary
}

export function LocaleProvider({ children, locale, dictionary }: LocaleProviderProps) {
  const isRtl = locale === 'ar'

  return (
    <LocaleContext.Provider value={{ locale, dictionary, isRtl }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }

  return context
}

export function useTranslation() {
  const { dictionary } = useLocale()
  return dictionary
}
