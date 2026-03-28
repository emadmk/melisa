'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Handshake, Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n/LocaleContext'

interface Brand {
  id: string
  name: string
  nameAr: string | null
  slug: string
  logo: string | null
  website: string | null
  _count?: { products: number }
}

const brandSlogans: Record<string, { tagline: string; lines: string[] }> = {
  neumann: {
    tagline: 'The Sound of Safety.',
    lines: [
      'PAGA, Intercom, and mission-critical communication systems',
      'engineered for environments where failure is not an option.',
      'From refineries to offshore platforms,',
      'NEUMANN stands for German engineering and absolute reliability.',
    ],
  },
  avigilon: {
    tagline: 'See More. Know More. Protect More.',
    lines: [
      'AI-powered video security and intelligent surveillance solutions',
      'designed for environments where every detail matters.',
      'From critical infrastructure to smart cities,',
      'Avigilon delivers clarity, intelligence, and security you can rely on.',
    ],
  },
  'cambium-networks': {
    tagline: 'Connectivity Without Limits.',
    lines: [
      'Wireless broadband solutions delivering reliable, high-speed,',
      'and secure communication across every environment.',
      'From microwave backhaul to enterprise Wi-Fi,',
      'Cambium Networks means dependable connectivity that never stops.',
    ],
  },
  motorola: {
    tagline: 'When It Matters Most.',
    lines: [
      'Mission-critical communication and security solutions',
      'built for reliability, speed, and absolute performance.',
      'From radios to command centers,',
      'Motorola Solutions delivers confidence when every second counts.',
    ],
  },
  'siae-microelettronica': {
    tagline: 'High Capacity. Zero Compromise.',
    lines: [
      'Carrier-grade microwave and wireless backhaul solutions',
      'engineered for performance, reliability, and scalability.',
      'From E-band to long-haul links,',
      'SIAE Microelettronica delivers ultra-high capacity connectivity.',
    ],
  },
  'navtech-radar': {
    tagline: '360° Awareness. Uninterrupted Security.',
    lines: [
      'Advanced radar solutions delivering precise, real-time',
      'perimeter protection in all weather and lighting conditions.',
      'From airports to critical infrastructure,',
      'Navtech Radar ensures total visibility and security that never sleeps.',
    ],
  },
  pelco: {
    tagline: 'Smart Vision. Stronger Security.',
    lines: [
      'Advanced video surveillance solutions',
      'built for clarity, control, and confidence.',
      'From real-time monitoring to intelligent analytics,',
      'Pelco delivers security you can trust.',
    ],
  },
}

const brandColors: Record<string, { bg: string; border: string; glow: string; accent: string }> = {
  neumann: { bg: 'from-amber-950 to-slate-900', border: 'hover:border-amber-500/30', glow: 'bg-amber-500/20', accent: 'text-amber-400' },
  avigilon: { bg: 'from-blue-950 to-slate-900', border: 'hover:border-blue-500/30', glow: 'bg-blue-500/20', accent: 'text-blue-400' },
  'cambium-networks': { bg: 'from-emerald-950 to-slate-900', border: 'hover:border-emerald-500/30', glow: 'bg-emerald-500/20', accent: 'text-emerald-400' },
  motorola: { bg: 'from-sky-950 to-slate-900', border: 'hover:border-sky-500/30', glow: 'bg-sky-500/20', accent: 'text-sky-400' },
  'siae-microelettronica': { bg: 'from-violet-950 to-slate-900', border: 'hover:border-violet-500/30', glow: 'bg-violet-500/20', accent: 'text-violet-400' },
  'navtech-radar': { bg: 'from-red-950 to-slate-900', border: 'hover:border-red-500/30', glow: 'bg-red-500/20', accent: 'text-red-400' },
  pelco: { bg: 'from-cyan-950 to-slate-900', border: 'hover:border-cyan-500/30', glow: 'bg-cyan-500/20', accent: 'text-cyan-400' },
}

const defaultColor = { bg: 'from-slate-800 to-slate-900', border: 'hover:border-primary/30', glow: 'bg-primary/20', accent: 'text-primary' }

const translations = {
  en: {
    badge: 'Our Partners',
    title: 'Trusted Technology Partners',
    subtitle: 'Official distributor and partner of leading global telecommunications and security brands',
    viewProducts: 'Explore',
    viewAll: 'View All Partners',
  },
  ar: {
    badge: 'شركاؤنا',
    title: 'شركاء التكنولوجيا الموثوقون',
    subtitle: 'شريك وموزع رسمي لأبرز العلامات التجارية العالمية في الاتصالات والأمن',
    viewProducts: 'استكشف',
    viewAll: 'عرض جميع الشركاء',
  },
}

export default function PartnersSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']
  const basePath = isArabic ? '/ar' : ''

  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('/api/brands')
        const data = await res.json()
        if (data.success && data.data) {
          setBrands(data.data)
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  return (
    <section className="py-20 lg:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            <Handshake className="w-4 h-4 text-primary" />
            {t.badge}
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No partners available</p>
          </div>
        ) : (
          /* Partners Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, index) => {
              const colors = brandColors[brand.slug] || defaultColor
              const slogan = brandSlogans[brand.slug]

              return (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link
                    href={`${basePath}/brands/${brand.slug}`}
                    className={`group relative block h-full rounded-2xl overflow-hidden border border-white/10 ${colors.border} transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40`}
                  >
                    {/* Card Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />
                    {/* Glow effect on hover */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 ${colors.glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                    <div className="relative p-6 sm:p-8 flex flex-col h-full min-h-[320px]">
                      {/* Logo */}
                      <div className="relative w-32 h-10 mb-8">
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain object-left brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity"
                            unoptimized
                          />
                        ) : (
                          <span className="text-lg font-bold text-white/60 group-hover:text-white/90 transition-colors">{brand.name}</span>
                        )}
                      </div>

                      {/* Slogan Content */}
                      {slogan ? (
                        <div className="flex-1">
                          <p className={`text-xl sm:text-2xl font-bold italic ${colors.accent} mb-4 leading-tight`}>
                            {slogan.tagline}
                          </p>
                          <div className="space-y-1">
                            {slogan.lines.map((line, i) => (
                              <p key={i} className="text-white/40 text-sm leading-relaxed">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-3">{brand.name}</h3>
                        </div>
                      )}

                      {/* Bottom Action */}
                      <div className={`mt-6 pt-5 border-t border-white/10 flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className={`inline-flex items-center gap-2 text-white/60 group-hover:text-white text-sm font-medium transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
                          {t.viewProducts}
                          {isArabic ? (
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          ) : (
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          )}
                        </span>
                        <span className="text-white/30 text-xs font-medium uppercase tracking-wider">
                          {brand.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href={`${basePath}/brands`}
            className={`inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-primary hover:text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {t.viewAll}
            {isArabic ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
