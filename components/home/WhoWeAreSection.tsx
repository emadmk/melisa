'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { Radio, Camera, Volume2, Shield, Award, Users, Globe, Headphones } from 'lucide-react'
import Image from 'next/image'

const translations = {
  en: {
    badge: 'About Us',
    title: 'Who We Are',
    subtitle: 'Your Trusted Partner in Advanced Communication Solutions',
    description: 'Since 2005, Melisa Trading LLC has been at the forefront of telecommunications and security solutions in the UAE. We deliver cutting-edge technology backed by unparalleled expertise and dedicated support.',
    features: [
      {
        icon: 'radio',
        title: 'Radio Communication',
        description: 'Professional two-way radio systems for public safety, transportation, and hospitality industries.',
      },
      {
        icon: 'camera',
        title: 'CCTV & Surveillance',
        description: 'Advanced HD surveillance systems with intelligent monitoring software for enhanced security.',
      },
      {
        icon: 'speaker',
        title: 'PA & Paging Systems',
        description: 'Reliable public address and paging solutions for healthcare, hospitality, and industrial facilities.',
      },
      {
        icon: 'shield',
        title: 'Security Integration',
        description: 'Comprehensive security solutions integrating multiple systems for complete protection.',
      },
    ],
    stats: [
      { icon: 'award', value: '19+', label: 'Years of Excellence' },
      { icon: 'users', value: '200+', label: 'Satisfied Clients' },
      { icon: 'globe', value: '50+', label: 'Major Projects' },
      { icon: 'support', value: '24/7', label: 'Expert Support' },
    ],
  },
  ar: {
    badge: 'من نحن',
    title: 'تعرف علينا',
    subtitle: 'شريكك الموثوق في حلول الاتصالات المتقدمة',
    description: 'منذ عام 2005، كانت ملیسا للتجارة في طليعة حلول الاتصالات والأمان في الإمارات. نقدم تقنية متطورة مدعومة بخبرة لا مثيل لها ودعم مخصص.',
    features: [
      {
        icon: 'radio',
        title: 'الاتصالات اللاسلكية',
        description: 'أنظمة راديو ثنائية الاتجاه احترافية للسلامة العامة والنقل وقطاع الضيافة.',
      },
      {
        icon: 'camera',
        title: 'كاميرات المراقبة',
        description: 'أنظمة مراقبة عالية الدقة مع برامج مراقبة ذكية لتعزيز الأمان.',
      },
      {
        icon: 'speaker',
        title: 'أنظمة النداء والإذاعة',
        description: 'حلول إذاعة عامة ونداء موثوقة للرعاية الصحية والضيافة والمنشآت الصناعية.',
      },
      {
        icon: 'shield',
        title: 'تكامل الأمان',
        description: 'حلول أمنية شاملة تدمج أنظمة متعددة للحماية الكاملة.',
      },
    ],
    stats: [
      { icon: 'award', value: '+19', label: 'سنوات من التميز' },
      { icon: 'users', value: '+200', label: 'عميل راضٍ' },
      { icon: 'globe', value: '+50', label: 'مشروع كبير' },
      { icon: 'support', value: '24/7', label: 'دعم متخصص' },
    ],
  },
}

const iconMap = {
  radio: Radio,
  camera: Camera,
  speaker: Volume2,
  shield: Shield,
  award: Award,
  users: Users,
  globe: Globe,
  support: Headphones,
}

export default function WhoWeAreSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={isArabic ? 'text-right lg:order-2' : ''}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <Award className="w-4 h-4" />
              {t.badge}
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {t.title}
            </h2>

            <p className="text-xl text-primary font-medium mb-4">
              {t.subtitle}
            </p>

            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              {t.description}
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {t.features.map((feature, index) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap]
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`group ${isArabic ? 'text-right' : ''}`}
                  >
                    <div className={`flex items-start gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right Content - Stats & Image */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={isArabic ? 'lg:order-1' : ''}
          >
            {/* Image with Overlay Stats */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/slider1-1024x486.webp"
                  alt="Melisa Telecommunications"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              </div>

              {/* Stats Cards */}
              <div className="absolute -bottom-8 left-4 right-4">
                <div className="grid grid-cols-4 gap-3">
                  {t.stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon as keyof typeof iconMap]
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="bg-white rounded-2xl p-4 shadow-xl text-center"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs text-slate-500">{stat.label}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className={`absolute -top-6 ${isArabic ? '-left-6' : '-right-6'} w-24 h-24 bg-primary/10 rounded-3xl -z-10`} />
              <div className={`absolute -bottom-16 ${isArabic ? '-right-6' : '-left-6'} w-32 h-32 bg-blue-500/10 rounded-3xl -z-10`} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
