'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n/LocaleContext'

interface Service {
  id: string
  titleFa: string
  titleEn: string | null
  titleAr: string | null
  slug: string
  shortDesc: string | null
  shortDescAr: string | null
  image: string | null
  order: number
}

const colorSchemes = [
  { color: 'from-blue-500/20 to-cyan-500/20', accent: 'text-blue-400' },
  { color: 'from-purple-500/20 to-pink-500/20', accent: 'text-purple-400' },
  { color: 'from-orange-500/20 to-amber-500/20', accent: 'text-orange-400' },
  { color: 'from-emerald-500/20 to-teal-500/20', accent: 'text-emerald-400' },
  { color: 'from-rose-500/20 to-red-500/20', accent: 'text-rose-400' },
  { color: 'from-indigo-500/20 to-violet-500/20', accent: 'text-indigo-400' },
]

const translations = {
  en: {
    badge: 'What We Do',
    title: 'Our Services',
    subtitle: 'Comprehensive telecommunications solutions from concept to completion',
    seeAll: 'View All Services',
    learnMore: 'Learn More',
  },
  ar: {
    badge: 'ما نقدمه',
    title: 'خدماتنا',
    subtitle: 'حلول اتصالات شاملة من المفهوم إلى الإنجاز',
    seeAll: 'عرض جميع الخدمات',
    learnMore: 'اعرف المزيد',
  },
}

export default function ServicesSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']
  const basePath = isArabic ? '/ar' : ''

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        if (data.success && data.data) {
          setServices(data.data.slice(0, 5)) // Max 5 services for homepage
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const getServiceTitle = (service: Service) => {
    if (isArabic && service.titleAr) return service.titleAr
    if (service.titleEn) return service.titleEn
    return service.titleFa
  }

  const getServiceDesc = (service: Service) => {
    if (isArabic && service.shortDescAr) return service.shortDescAr
    return service.shortDesc || ''
  }

  return (
    <section className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-blue-500/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-16 ${isArabic ? 'text-right' : ''}`}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            <Sparkles className="w-4 h-4" />
            {t.badge}
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.title}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No services available</p>
          </div>
        ) : (
          /* Services Grid - Bento Style */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const scheme = colorSchemes[index % colorSchemes.length]
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <Link href={`${basePath}/services/${service.slug}`}>
                    <div className={`relative h-full min-h-[280px] ${index === 0 ? 'lg:min-h-[580px]' : ''} rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500`}>
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={getServiceTitle(service)}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${scheme.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      </div>

                      {/* Content */}
                      <div className={`absolute inset-0 p-6 lg:p-8 flex flex-col justify-end ${isArabic ? 'text-right' : ''}`}>
                        {/* Number Badge */}
                        <div className={`absolute top-6 ${isArabic ? 'left-6' : 'right-6'}`}>
                          <span className="text-6xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                            0{index + 1}
                          </span>
                        </div>

                        <div>
                          <h3 className={`text-2xl ${index === 0 ? 'lg:text-3xl' : ''} font-bold text-white mb-3 group-hover:text-primary transition-colors`}>
                            {getServiceTitle(service)}
                          </h3>
                          <p className={`text-white/80 ${index === 0 ? 'text-base lg:text-lg' : 'text-sm'} leading-relaxed mb-4 line-clamp-3`}>
                            {getServiceDesc(service)}
                          </p>

                          {/* Learn More Button */}
                          <div className={`inline-flex items-center gap-2 text-white font-medium group-hover:text-primary transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
                            {t.learnMore}
                            {isArabic ? (
                              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                            ) : (
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Border Effect */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-colors pointer-events-none" />
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
            href={`${basePath}/services`}
            className={`inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-primary transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {t.seeAll}
            {isArabic ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
