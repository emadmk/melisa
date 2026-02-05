'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { locales, localeNames, type Locale, removeLocaleFromPathname, getLocaleFromPathname } from '@/lib/i18n/config'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = getLocaleFromPathname(pathname) as Locale
  const pathWithoutLocale = removeLocaleFromPathname(pathname)

  const switchLocale = (newLocale: Locale) => {
    // Set cookie for middleware
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`

    // Navigate to new locale path
    if (newLocale === 'en') {
      // English is default, use root path
      router.push(pathWithoutLocale || '/')
    } else {
      // Other locales use /locale/path
      router.push(`/${newLocale}${pathWithoutLocale}`)
    }
  }

  return (
    <div className="flex items-center gap-2 border-l border-white/20 pl-4">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center">
          <button
            onClick={() => switchLocale(locale)}
            className={`flex items-center gap-1 transition-colors ${
              currentLocale === locale
                ? 'text-white font-medium'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {index === 0 && <Globe className="w-4 h-4" />}
            <span>{localeNames[locale]}</span>
          </button>
          {index < locales.length - 1 && (
            <span className="text-white/40 mx-2">|</span>
          )}
        </span>
      ))}
    </div>
  )
}
