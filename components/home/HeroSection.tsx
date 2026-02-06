'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Play, Shield, Radio, Camera, Volume2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n/LocaleContext'

const translations = {
  en: {
    badge: 'Leading Telecom Solutions in UAE',
    title1: 'Next Generation',
    title2: 'Communication',
    title3: 'Systems',
    description: 'Empowering businesses with cutting-edge telecommunications, security surveillance, and radio communication solutions since 2005.',
    exploreProducts: 'Explore Products',
    ourServices: 'Our Services',
    watchVideo: 'Watch Video',
    stats: {
      projects: 'Projects Completed',
      clients: 'Happy Clients',
      experience: 'Years Experience',
      support: 'Support'
    },
    features: [
      { icon: 'radio', title: 'Radio Systems', desc: 'Professional two-way radios' },
      { icon: 'camera', title: 'CCTV Solutions', desc: 'HD surveillance systems' },
      { icon: 'speaker', title: 'PA & Paging', desc: 'Public address systems' },
      { icon: 'shield', title: 'Security', desc: 'Integrated solutions' },
    ]
  },
  ar: {
    badge: 'الشركة الرائدة في حلول الاتصالات في الإمارات',
    title1: 'أنظمة الاتصالات',
    title2: 'المتطورة',
    title3: 'للمستقبل',
    description: 'نمكّن الشركات من خلال حلول الاتصالات والمراقبة الأمنية والاتصالات اللاسلكية المتطورة منذ عام 2005.',
    exploreProducts: 'استكشف المنتجات',
    ourServices: 'خدماتنا',
    watchVideo: 'شاهد الفيديو',
    stats: {
      projects: 'مشروع مكتمل',
      clients: 'عميل سعيد',
      experience: 'سنوات خبرة',
      support: 'دعم فني'
    },
    features: [
      { icon: 'radio', title: 'أنظمة الراديو', desc: 'أجهزة لاسلكية احترافية' },
      { icon: 'camera', title: 'حلول المراقبة', desc: 'أنظمة مراقبة عالية الدقة' },
      { icon: 'speaker', title: 'أنظمة النداء', desc: 'أنظمة الإذاعة العامة' },
      { icon: 'shield', title: 'الأمان', desc: 'حلول متكاملة' },
    ]
  },
}

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function HeroSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']
  const basePath = isArabic ? '/ar' : ''

  const iconMap = {
    radio: Radio,
    camera: Camera,
    speaker: Volume2,
    shield: Shield,
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Shapes */}
        <FloatingShape
          className="absolute top-20 right-[20%] w-20 h-20 border border-primary/20 rounded-2xl rotate-12"
          delay={0}
        />
        <FloatingShape
          className="absolute top-40 left-[15%] w-12 h-12 bg-primary/10 rounded-full"
          delay={1}
        />
        <FloatingShape
          className="absolute bottom-32 right-[30%] w-16 h-16 border border-white/10 rounded-xl rotate-45"
          delay={2}
        />
        <FloatingShape
          className="absolute bottom-48 left-[25%] w-8 h-8 bg-blue-500/20 rounded-lg"
          delay={0.5}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-16 lg:pt-40 lg:pb-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={isArabic ? 'text-right' : ''}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6 sm:mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-primary text-xs sm:text-sm font-medium">{t.badge}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6"
            >
              <span className="text-white">{t.title1}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">
                {t.title2}
              </span>
              <br />
              <span className="text-white">{t.title3}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-400 text-sm sm:text-base lg:text-xl leading-relaxed mb-8 sm:mb-10 max-w-xl"
            >
              {t.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${isArabic ? 'sm:justify-end' : ''}`}
            >
              <Link
                href={`${basePath}/products`}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-primary rounded-xl font-semibold text-white overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-105 text-center sm:text-left text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
                  {t.exploreProducts}
                  {isArabic ? <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href={`${basePath}/services`}
                className="group px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
              >
                {t.ourServices}
                {isArabic ? <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" /> : <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-white/10 ${isArabic ? 'text-right' : ''}`}
            >
              {[
                { value: '500+', label: t.stats.projects },
                { value: '200+', label: t.stats.clients },
                { value: '19+', label: t.stats.experience },
                { value: '24/7', label: t.stats.support },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-500 text-[10px] sm:text-xs lg:text-sm leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {t.features.map((feature, index) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap]
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all cursor-pointer ${
                      index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <div className={`flex items-start gap-3 sm:gap-4 ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold text-sm sm:text-lg mb-0.5 sm:mb-1 truncate">{feature.title}</h3>
                        <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">{feature.desc}</p>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.div>
                )
              })}
            </div>

            {/* Featured Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 relative rounded-2xl overflow-hidden group"
            >
              <div className="aspect-video relative">
                <Image
                  src="/images/slider1-1024x486.webp"
                  alt="Melisa Telecommunications"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors"
                  >
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </motion.button>
                </div>

                {/* Video Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/80 text-sm">{t.watchVideo}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(249 250 251)"
          />
        </svg>
      </div>
    </section>
  )
}
