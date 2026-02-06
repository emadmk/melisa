'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/LocaleContext'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
}

const translations = {
  en: {
    title: 'Trusted by Industry Leaders',
    subtitle: 'Official distributor of world-renowned brands',
  },
  ar: {
    title: 'موثوق من قبل رواد الصناعة',
    subtitle: 'موزع رسمي للعلامات التجارية العالمية',
  },
}

export default function BrandsMarquee() {
  const [brands, setBrands] = useState<Brand[]>([])
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setBrands(data.data)
        }
      })
      .catch(console.error)
  }, [])

  if (brands.length === 0) {
    return null
  }

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands]

  return (
    <section className="py-16 lg:py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-12 ${isArabic ? 'text-right' : ''}`}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            {t.title}
          </h2>
          <p className="text-slate-400 text-lg">
            {t.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />

        {/* Marquee Track */}
        <div className="flex animate-marquee">
          {duplicatedBrands.map((brand, index) => (
            <Link
              key={`${brand.slug}-${index}`}
              href={`/brands/${brand.slug}`}
              className="group flex-shrink-0 mx-6 lg:mx-10"
            >
              <div className="relative w-40 h-20 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-300">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain p-3 brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{brand.name}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
