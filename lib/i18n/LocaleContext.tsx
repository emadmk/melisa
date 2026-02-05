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
  return context // Returns null if not in a LocaleProvider (e.g., English pages)
}

export function useLocaleRequired() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocaleRequired must be used within a LocaleProvider')
  }

  return context
}

export function useTranslation() {
  const context = useLocale()
  return context?.dictionary ?? null
}
