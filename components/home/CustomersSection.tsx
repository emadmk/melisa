'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useLocale } from '@/lib/i18n/LocaleContext'

const testimonialsEn = [
  {
    id: 1,
    name: 'Ahmed Al Mansouri',
    position: 'Operations Director',
    company: 'Gulf Security Solutions',
    text: 'Melisa provided us with exceptional CCTV and surveillance systems. Their technical expertise and after-sales support have been outstanding. Highly recommended for any security project.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Thompson',
    position: 'IT Manager',
    company: 'Emirates Industrial Group',
    text: 'We have been working with Melisa for our radio communication needs for over 3 years. Their Motorola solutions have significantly improved our operational efficiency.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Mohammad Al Hashimi',
    position: 'Technical Manager',
    company: 'Dubai Port Services',
    text: 'The microwave link solutions from Melisa have transformed our connectivity infrastructure. Professional team with deep technical knowledge.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Fatima Al Zaabi',
    position: 'Procurement Head',
    company: 'Abu Dhabi Construction LLC',
    text: 'Excellent service and competitive pricing. Melisa delivered our complete PAGA system on time and within budget. Their support team is always responsive.',
    rating: 5,
  },
]

const testimonialsAr = [
  {
    id: 1,
    name: 'أحمد المنصوري',
    position: 'مدير العمليات',
    company: 'حلول الخليج للأمن',
    text: 'قدمت لنا ميليسا أنظمة مراقبة وكاميرات استثنائية. خبرتهم التقنية ودعمهم بعد البيع كانا متميزين. نوصي بهم بشدة لأي مشروع أمني.',
    rating: 5,
  },
  {
    id: 2,
    name: 'سارة طومسون',
    position: 'مديرة تقنية المعلومات',
    company: 'مجموعة الإمارات الصناعية',
    text: 'نعمل مع ميليسا لتلبية احتياجاتنا في مجال الاتصالات اللاسلكية منذ أكثر من 3 سنوات. حلول موتورولا التي قدموها حسّنت كفاءتنا التشغيلية بشكل كبير.',
    rating: 5,
  },
  {
    id: 3,
    name: 'محمد الهاشمي',
    position: 'المدير التقني',
    company: 'خدمات موانئ دبي',
    text: 'حلول وصلات الميكروويف من ميليسا غيّرت بنيتنا التحتية للاتصالات. فريق محترف يمتلك معرفة تقنية عميقة.',
    rating: 5,
  },
  {
    id: 4,
    name: 'فاطمة الزعابي',
    position: 'رئيسة المشتريات',
    company: 'شركة أبوظبي للإنشاءات',
    text: 'خدمة ممتازة وأسعار تنافسية. سلّمت ميليسا نظام الإعلان والنداء العام الخاص بنا في الوقت المحدد وضمن الميزانية. فريق الدعم لديهم متجاوب دائماً.',
    rating: 5,
  },
]

const translations = {
  en: {
    badge: 'Testimonials',
    title: 'What Our Clients Say',
    subtitle: 'Trusted by leading companies across the UAE and Middle East',
  },
  ar: {
    badge: 'آراء العملاء',
    title: 'ماذا يقول عملاؤنا',
    subtitle: 'موثوق من قبل الشركات الرائدة في الإمارات والشرق الأوسط',
  },
}

export default function CustomersSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']
  const testimonials = isArabic ? testimonialsAr : testimonialsEn

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextTestimonial, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextTestimonial])

  const handleManualNavigation = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false)
    if (direction === 'prev') prevTestimonial()
    else nextTestimonial()
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-16 ${isArabic ? 'text-right' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            <Quote className="w-4 h-4" />
            {t.badge}
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.title}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => handleManualNavigation('prev')}
              className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-0 translate-x-4 lg:translate-x-16' : 'left-0 -translate-x-4 lg:-translate-x-16'} z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-xl transition-all`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleManualNavigation('next')}
              className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-0 -translate-x-4 lg:-translate-x-16' : 'right-0 translate-x-4 lg:translate-x-16'} z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-xl transition-all`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Testimonial Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-3xl shadow-xl p-8 lg:p-12 ${isArabic ? 'text-right' : ''}`}
              >
                {/* Quote Icon */}
                <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Quote className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 text-xl lg:text-2xl leading-relaxed mb-8 font-light">
                  &ldquo;{testimonials[currentIndex].text}&rdquo;
                </p>

                {/* Rating */}
                <div className={`flex gap-1 mb-6 ${isArabic ? 'justify-end' : ''}`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                {/* Author Info */}
                <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-slate-500">
                      {testimonials[currentIndex].position}
                    </p>
                    <p className="text-primary text-sm font-medium">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                    setTimeout(() => setIsAutoPlaying(true), 10000)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-slate-300 w-2 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
