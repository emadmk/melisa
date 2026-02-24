'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Shield, Camera, Volume2, Wifi } from 'lucide-react'
import { useLocale } from '@/lib/i18n/LocaleContext'

interface SlideData {
  id: number
  badge: string
  title: string
  titleAccent: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  accentColor: string
  features: string[]
  stats: { value: string; label: string }[]
}

const slidesEn: SlideData[] = [
  {
    id: 1,
    badge: 'Advanced Radar Technology',
    title: 'Perimeter',
    titleAccent: 'Radar Security',
    subtitle: 'Navtech Radar Systems',
    description: 'Next-generation radar surveillance systems for critical infrastructure protection. 360° detection coverage with AI-powered threat classification.',
    image: '/images/03.webp',
    ctaText: 'Explore Radar Systems',
    ctaLink: '/products/category/radar-surveillance-system',
    secondaryCtaText: 'Get a Quote',
    secondaryCtaLink: '/contact',
    accentColor: '#3B82F6',
    features: ['360° Coverage', 'AI Classification', 'All-Weather'],
    stats: [
      { value: '5km+', label: 'Detection Range' },
      { value: '0.1s', label: 'Response Time' },
      { value: '24/7', label: 'Monitoring' },
    ],
  },
  {
    id: 2,
    badge: 'Industrial PA/GA Systems',
    title: 'Public Address &',
    titleAccent: 'General Alarm',
    subtitle: 'Neumann Elektronik',
    description: 'IEC 62368 & EN 54-16 certified PAGA systems for oil & gas, petrochemical, and critical industrial facilities worldwide.',
    image: '/images/paging.webp',
    ctaText: 'View PAGA Systems',
    ctaLink: '/products/category/paga',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/brands/neumann',
    accentColor: '#F97316',
    features: ['IEC Certified', 'Hazardous Areas', 'Redundant Design'],
    stats: [
      { value: '500+', label: 'Installations' },
      { value: '50+', label: 'Countries' },
      { value: '99.9%', label: 'Uptime' },
    ],
  },
  {
    id: 3,
    badge: 'Mission-Critical Communications',
    title: 'TETRA & DMR',
    titleAccent: 'Radio Systems',
    subtitle: 'Motorola Solutions',
    description: 'Enterprise-grade digital radio communication systems for public safety, defense, and industrial operations with seamless coverage.',
    image: '/images/radio.webp',
    ctaText: 'Discover Radio Solutions',
    ctaLink: '/products/category/radio',
    secondaryCtaText: 'Contact Sales',
    secondaryCtaLink: '/contact',
    accentColor: '#DC2626',
    features: ['TETRA/DMR/P25', 'Encrypted', 'GPS Tracking'],
    stats: [
      { value: '200+', label: 'Active Networks' },
      { value: '100km', label: 'Coverage Area' },
      { value: 'AES256', label: 'Encryption' },
    ],
  },
]

const slidesAr: SlideData[] = [
  {
    id: 1,
    badge: 'تقنية الرادار المتقدمة',
    title: 'أمن محيطي',
    titleAccent: 'بتقنية الرادار',
    subtitle: 'أنظمة نافتيك رادار',
    description: 'أنظمة رادار للمراقبة من الجيل التالي لحماية البنية التحتية الحيوية. تغطية كشف 360 درجة مع تصنيف تهديدات بالذكاء الاصطناعي.',
    image: '/images/03.webp',
    ctaText: 'استكشف أنظمة الرادار',
    ctaLink: '/ar/products/category/radar-surveillance-system',
    secondaryCtaText: 'احصل على عرض سعر',
    secondaryCtaLink: '/ar/contact',
    accentColor: '#3B82F6',
    features: ['تغطية 360°', 'تصنيف ذكي', 'جميع الأحوال الجوية'],
    stats: [
      { value: '+5km', label: 'نطاق الكشف' },
      { value: '0.1s', label: 'وقت الاستجابة' },
      { value: '24/7', label: 'المراقبة' },
    ],
  },
  {
    id: 2,
    badge: 'أنظمة النداء العام الصناعية',
    title: 'أنظمة النداء العام',
    titleAccent: 'والإنذار',
    subtitle: 'نيومان إلكترونيك',
    description: 'أنظمة نداء عام معتمدة وفق IEC 62368 و EN 54-16 للنفط والغاز والمنشآت الصناعية الحيوية حول العالم.',
    image: '/images/paging.webp',
    ctaText: 'عرض أنظمة النداء',
    ctaLink: '/ar/products/category/paga',
    secondaryCtaText: 'اعرف المزيد',
    secondaryCtaLink: '/ar/brands/neumann',
    accentColor: '#F97316',
    features: ['معتمد دولياً', 'مناطق خطرة', 'تصميم احتياطي'],
    stats: [
      { value: '+500', label: 'تركيب' },
      { value: '+50', label: 'دولة' },
      { value: '99.9%', label: 'وقت التشغيل' },
    ],
  },
  {
    id: 3,
    badge: 'اتصالات المهام الحرجة',
    title: 'أنظمة راديو',
    titleAccent: 'TETRA و DMR',
    subtitle: 'موتورولا سوليوشنز',
    description: 'أنظمة اتصالات رقمية للسلامة العامة والدفاع والعمليات الصناعية مع تغطية سلسة.',
    image: '/images/radio.webp',
    ctaText: 'اكتشف حلول الراديو',
    ctaLink: '/ar/products/category/radio',
    secondaryCtaText: 'اتصل بالمبيعات',
    secondaryCtaLink: '/ar/contact',
    accentColor: '#DC2626',
    features: ['TETRA/DMR/P25', 'مشفر', 'تتبع GPS'],
    stats: [
      { value: '+200', label: 'شبكة نشطة' },
      { value: '100km', label: 'منطقة التغطية' },
      { value: 'AES256', label: 'التشفير' },
    ],
  },
]

// Animated counter component
function AnimatedCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {value}
    </motion.span>
  )
}

// Particle system
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Slide progress indicator
function SlideProgress({ total, current, onSelect, accentColor }: { total: number; current: number; onSelect: (i: number) => void; accentColor: string }) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative group"
        >
          <div className="w-12 sm:w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            {i === current && (
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: accentColor }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 6, ease: 'linear' }}
                key={`progress-${current}`}
              />
            )}
            {i < current && (
              <div className="h-full w-full rounded-full" style={{ backgroundColor: accentColor }} />
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const slides = isArabic ? slidesAr : slidesEn
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }, [currentSlide])

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const slide = slides[currentSlide]

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  }

  const contentVariants = {
    enter: { opacity: 0, y: 40 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <section className="relative h-screen min-h-[700px] max-h-[900px] overflow-hidden bg-slate-950">
      {/* Background Image Slider */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
          {/* Accent color overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(ellipse at 70% 50%, ${slide.accentColor}, transparent 70%)` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Particles */}
      <Particles />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex items-center pt-32 sm:pt-36 pb-16">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
              >
                {/* Left: Text Content */}
                <div className={isArabic ? 'text-right order-2 lg:order-1' : 'order-2 lg:order-1'}>
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}
                    style={{
                      borderColor: `${slide.accentColor}40`,
                      backgroundColor: `${slide.accentColor}15`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: slide.accentColor }}
                    />
                    <span className="text-xs sm:text-sm font-medium" style={{ color: slide.accentColor }}>
                      {slide.badge}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-3">
                      <span className="text-white">{slide.title}</span>
                      <br />
                      <span
                        className="bg-clip-text text-transparent"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}CC, white)`,
                        }}
                      >
                        {slide.titleAccent}
                      </span>
                    </h1>
                    <p className="text-white/50 text-sm sm:text-base font-medium tracking-wider uppercase mb-4">
                      {slide.subtitle}
                    </p>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-xl"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Feature Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className={`flex flex-wrap gap-2 mb-8 ${isArabic ? 'justify-end' : ''}`}
                  >
                    {slide.features.map((feature, i) => (
                      <motion.span
                        key={feature}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="px-3 py-1 text-xs font-medium rounded-full border border-white/10 text-white/70 bg-white/5 backdrop-blur-sm"
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className={`flex flex-col sm:flex-row gap-3 ${isArabic ? 'sm:justify-end' : ''}`}
                  >
                    <Link
                      href={slide.ctaLink}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white overflow-hidden transition-all hover:shadow-lg text-center sm:text-left text-sm sm:text-base"
                      style={{
                        backgroundColor: slide.accentColor,
                        boxShadow: `0 8px 32px ${slide.accentColor}40`,
                      }}
                    >
                      <span className={`relative z-10 flex items-center justify-center sm:justify-start gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {slide.ctaText}
                        {isArabic ? (
                          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        )}
                      </span>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}CC)` }}
                      />
                    </Link>

                    <Link
                      href={slide.secondaryCtaLink}
                      className="group px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
                    >
                      {slide.secondaryCtaText}
                      {isArabic ? (
                        <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                      ) : (
                        <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                      )}
                    </Link>
                  </motion.div>
                </div>

                {/* Right: Stats & Visual */}
                <div className="relative order-1 lg:order-2 hidden lg:block">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="relative"
                  >
                    {/* Glowing backdrop */}
                    <div
                      className="absolute -inset-8 rounded-3xl blur-3xl opacity-20"
                      style={{ backgroundColor: slide.accentColor }}
                    />

                    {/* Stats Cards */}
                    <div className="relative grid grid-cols-3 gap-4">
                      {slide.stats.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                          className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
                        >
                          <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: `linear-gradient(135deg, ${slide.accentColor}10, transparent)` }}
                          />
                          <div className="relative">
                            <div className="text-2xl xl:text-3xl font-bold text-white mb-1">
                              <AnimatedCounter value={stat.value} delay={800 + i * 200} />
                            </div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Decorative ring */}
                    <motion.div
                      className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full border opacity-20"
                      style={{ borderColor: slide.accentColor }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border opacity-10"
                      style={{ borderColor: slide.accentColor }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Category Quick Links */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="mt-8 grid grid-cols-2 gap-3"
                    >
                      {[
                        { icon: Camera, label: isArabic ? 'كاميرات المراقبة' : 'CCTV', link: '/products/category/cctv', color: '#10B981' },
                        { icon: Wifi, label: isArabic ? 'الميكروويف' : 'Microwave', link: '/products/category/microwave', color: '#8B5CF6' },
                        { icon: Shield, label: isArabic ? 'الرادار' : 'Radar', link: '/products/category/radar-surveillance-system', color: '#3B82F6' },
                        { icon: Volume2, label: isArabic ? 'النداء العام' : 'PAGA', link: '/products/category/paga', color: '#F97316' },
                      ].map((item, i) => (
                        <Link
                          key={item.label}
                          href={isArabic ? `/ar${item.link}` : item.link}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + i * 0.1 }}
                            whileHover={{ x: 4, scale: 1.02 }}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                          >
                            <div
                              className="p-2 rounded-lg transition-all"
                              style={{ backgroundColor: `${item.color}20`, color: item.color }}
                            >
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                              {item.label}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Progress */}
              <SlideProgress
                total={slides.length}
                current={currentSlide}
                onSelect={goToSlide}
                accentColor={slide.accentColor}
              />

              {/* Slide Counter */}
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <span className="text-white font-bold text-lg" style={{ color: slide.accentColor }}>
                  {String(currentSlide + 1).padStart(2, '0')}
                </span>
                <span>/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 36C840 40 960 48 1080 52C1200 56 1320 56 1380 56L1440 56V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            fill="rgb(249 250 251)"
          />
        </svg>
      </div>
    </section>
  )
}
