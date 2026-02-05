'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  _count?: { products: number }
}

const testimonialsEn = [
  {
    id: 1,
    name: 'Ahmed Al Mansouri',
    position: 'Operations Director',
    company: 'Gulf Security Solutions',
    text: 'Melisa provided us with exceptional CCTV and surveillance systems. Their technical expertise and after-sales support have been outstanding. Highly recommended for any security project.',
    avatar: '/images/avatar-1.webp',
  },
  {
    id: 2,
    name: 'Sarah Thompson',
    position: 'IT Manager',
    company: 'Emirates Industrial Group',
    text: 'We have been working with Melisa for our radio communication needs for over 3 years. Their Motorola solutions have significantly improved our operational efficiency.',
    avatar: '/images/avatar-2.webp',
  },
  {
    id: 3,
    name: 'Mohammad Al Hashimi',
    position: 'Technical Manager',
    company: 'Dubai Port Services',
    text: 'The microwave link solutions from Melisa have transformed our connectivity infrastructure. Professional team with deep technical knowledge.',
    avatar: '/images/avatar-3.webp',
  },
  {
    id: 4,
    name: 'Fatima Al Zaabi',
    position: 'Procurement Head',
    company: 'Abu Dhabi Construction LLC',
    text: 'Excellent service and competitive pricing. Melisa delivered our complete PAGA system on time and within budget. Their support team is always responsive.',
    avatar: '/images/avatar-4.webp',
  },
  {
    id: 5,
    name: 'James Wilson',
    position: 'Project Manager',
    company: 'Sharjah Telecom Solutions',
    text: 'From consultation to installation, Melisa demonstrated professionalism at every step. Their wireless solutions have exceeded our expectations.',
    avatar: '/images/avatar-5.webp',
  },
]

const testimonialsAr = [
  {
    id: 1,
    name: 'أحمد المنصوري',
    position: 'مدير العمليات',
    company: 'حلول الخليج للأمن',
    text: 'قدمت لنا ميليسا أنظمة مراقبة وكاميرات استثنائية. خبرتهم التقنية ودعمهم بعد البيع كانا متميزين. نوصي بهم بشدة لأي مشروع أمني.',
    avatar: '/images/avatar-1.webp',
  },
  {
    id: 2,
    name: 'سارة طومسون',
    position: 'مديرة تقنية المعلومات',
    company: 'مجموعة الإمارات الصناعية',
    text: 'نعمل مع ميليسا لتلبية احتياجاتنا في مجال الاتصالات اللاسلكية منذ أكثر من 3 سنوات. حلول موتورولا التي قدموها حسّنت كفاءتنا التشغيلية بشكل كبير.',
    avatar: '/images/avatar-2.webp',
  },
  {
    id: 3,
    name: 'محمد الهاشمي',
    position: 'المدير التقني',
    company: 'خدمات موانئ دبي',
    text: 'حلول وصلات الميكروويف من ميليسا غيّرت بنيتنا التحتية للاتصالات. فريق محترف يمتلك معرفة تقنية عميقة.',
    avatar: '/images/avatar-3.webp',
  },
  {
    id: 4,
    name: 'فاطمة الزعابي',
    position: 'رئيسة المشتريات',
    company: 'شركة أبوظبي للإنشاءات',
    text: 'خدمة ممتازة وأسعار تنافسية. سلّمت ميليسا نظام الإعلان والنداء العام الخاص بنا في الوقت المحدد وضمن الميزانية. فريق الدعم لديهم متجاوب دائماً.',
    avatar: '/images/avatar-4.webp',
  },
  {
    id: 5,
    name: 'جيمس ويلسون',
    position: 'مدير المشاريع',
    company: 'حلول الشارقة للاتصالات',
    text: 'من الاستشارة إلى التركيب، أظهرت ميليسا احترافية في كل خطوة. حلولهم اللاسلكية تجاوزت توقعاتنا.',
    avatar: '/images/avatar-5.webp',
  },
]

const translations = {
  en: {
    customersTitle: 'These Are Our Best Customers',
    customersSubtitle: 'that enjoy to work with us',
    testimonialsTitle: 'WE ARE GLAD TO HEAR FROM YOU',
    noBrands: 'No brands available',
  },
  ar: {
    customersTitle: 'هؤلاء هم أفضل عملائنا',
    customersSubtitle: 'الذين يستمتعون بالعمل معنا',
    testimonialsTitle: 'يسعدنا سماع آرائكم',
    noBrands: 'لا توجد علامات تجارية متاحة',
  },
}

export default function CustomersSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']
  const testimonials = isArabic ? testimonialsAr : testimonialsEn

  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch('/api/brands')
        const data = await response.json()
        if (data.success && data.data) {
          const brandsWithLogos = data.data.filter((brand: Brand) => brand.logo)
          setBrands(brandsWithLogos)
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextTestimonial])

  const handleManualNavigation = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false)
    if (direction === 'prev') prevTestimonial()
    else nextTestimonial()
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            {t.customersTitle}
          </h2>
          <p className="text-gray-600">
            {t.customersSubtitle}
          </p>
        </motion.div>

        {/* Brand Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 lg:gap-12"
        >
          {loading ? (
            <div className="flex gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-12 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          ) : brands.length > 0 ? (
            brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={brand.logo || '/images/placeholder.webp'}
                  alt={brand.name}
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain"
                  unoptimized
                />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">{t.noBrands}</p>
          )}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-primary text-center mb-12">
            {t.testimonialsTitle}
          </h3>

          {/* Testimonial Slider */}
          <div className="relative max-w-4xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={() => handleManualNavigation('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleManualNavigation('next')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Testimonial Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 relative overflow-hidden">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                    {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-6 italic">
                    &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                  </p>

                  {/* Author Info */}
                  <div>
                    <p className="font-bold text-primary text-lg">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-gray-500">
                      {testimonials[currentTestimonial].position}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {testimonials[currentTestimonial].company}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentTestimonial(index)
                    setIsAutoPlaying(false)
                    setTimeout(() => setIsAutoPlaying(true), 10000)
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-primary w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
