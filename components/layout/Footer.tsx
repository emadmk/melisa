'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  ArrowRight,
  ArrowLeft,
  Radio,
  Camera,
  Volume2,
  Wifi,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/seo'
import { useLocale } from '@/lib/i18n/LocaleContext'

const contentEn = {
  tagline: 'Leading Telecommunications Solutions',
  description: 'Your trusted partner for professional communication systems, security solutions, and cutting-edge telecommunications equipment since 2005.',
  quickLinks: 'Quick Links',
  services: 'Our Services',
  contact: 'Get In Touch',
  newsletter: 'Stay Updated',
  newsletterText: 'Subscribe to our newsletter for latest updates and industry insights.',
  subscribe: 'Subscribe',
  emailPlaceholder: 'Enter your email',
  copyright: '© 2026 Melisa Trading LLC. All rights reserved.',
  designedBy: 'Designed By Emad Makhdumi',
  links: [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Brands', href: '/brands' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  servicesList: [
    { name: 'Radio Communication', icon: 'radio' },
    { name: 'CCTV & Surveillance', icon: 'camera' },
    { name: 'PA & Paging Systems', icon: 'speaker' },
    { name: 'Wireless Solutions', icon: 'wifi' },
  ],
}

const contentAr = {
  tagline: 'الرائدة في حلول الاتصالات',
  description: 'شريكك الموثوق لأنظمة الاتصالات الاحترافية وحلول الأمان ومعدات الاتصالات المتطورة منذ عام 2005.',
  quickLinks: 'روابط سريعة',
  services: 'خدماتنا',
  contact: 'تواصل معنا',
  newsletter: 'ابق على اطلاع',
  newsletterText: 'اشترك في نشرتنا الإخبارية لآخر التحديثات ورؤى الصناعة.',
  subscribe: 'اشترك',
  emailPlaceholder: 'أدخل بريدك الإلكتروني',
  copyright: '© 2026 ملیسا للتجارة ذ.م.م. جميع الحقوق محفوظة.',
  designedBy: 'تصميم Emad Makhdumi',
  links: [
    { name: 'الرئيسية', href: '/ar' },
    { name: 'المنتجات', href: '/ar/products' },
    { name: 'العلامات التجارية', href: '/ar/brands' },
    { name: 'من نحن', href: '/ar/about' },
    { name: 'اتصل بنا', href: '/ar/contact' },
    { name: 'المدونة', href: '/ar/blog' },
    { name: 'سياسة الخصوصية', href: '/ar/privacy' },
  ],
  servicesList: [
    { name: 'الاتصالات اللاسلكية', icon: 'radio' },
    { name: 'كاميرات المراقبة', icon: 'camera' },
    { name: 'أنظمة النداء والإذاعة', icon: 'speaker' },
    { name: 'الحلول اللاسلكية', icon: 'wifi' },
  ],
}

const iconMap = {
  radio: Radio,
  camera: Camera,
  speaker: Volume2,
  wifi: Wifi,
}

export default function Footer() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const content = isArabic ? contentAr : contentEn
  const basePath = isArabic ? '/ar' : ''

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Red Accent Line */}
      <div className="h-1 bg-gradient-to-r from-primary via-red-500 to-primary" />

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`lg:col-span-1 ${isArabic ? 'text-right' : ''}`}
          >
            <Link href={basePath || '/'} className={`inline-flex items-center gap-3 mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Image
                src="/images/melisa-logo.webp"
                alt="Melisa"
                width={44}
                height={44}
                className="h-10 w-auto"
              />
              <span className="text-white text-xl font-bold tracking-[0.15em]">
                MELISA
              </span>
            </Link>

            <p className="text-primary font-medium mb-3">{content.tagline}</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {content.description}
            </p>

            {/* Social Links */}
            <div className={`flex items-center gap-3 ${isArabic ? 'justify-end' : ''}`}>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-primary flex items-center justify-center text-slate-400 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-primary flex items-center justify-center text-slate-400 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={isArabic ? 'text-right' : ''}
          >
            <h4 className="text-white font-semibold mb-6">{content.quickLinks}</h4>
            <ul className="space-y-3">
              {content.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}
                  >
                    {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={isArabic ? 'text-right' : ''}
          >
            <h4 className="text-white font-semibold mb-6">{content.services}</h4>
            <ul className="space-y-3">
              {content.servicesList.map((service) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap]
                return (
                  <li key={service.name}>
                    <div className={`flex items-center gap-3 text-slate-400 text-sm ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                      <Icon className="w-4 h-4 text-primary" />
                      {service.name}
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={isArabic ? 'text-right' : ''}
          >
            <h4 className="text-white font-semibold mb-6">{content.contact}</h4>
            <div className="space-y-4">
              {/* Location */}
              <div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {siteConfig.address}
                </p>
              </div>

              {/* Phone */}
              <div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="text-slate-400 text-sm">
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-primary transition-colors block">
                    {siteConfig.phone}
                  </a>
                  <a href={`tel:${siteConfig.phone2}`} className="hover:text-primary transition-colors block">
                    {siteConfig.phone2}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-slate-400 text-sm hover:text-primary transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-4">
              <Link
                href={isArabic ? '/ar/privacy' : '/privacy'}
                className="hover:text-primary transition-colors"
              >
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <span className="w-px h-4 bg-slate-700" />
              <a
                href="mailto:makhdoumiemad@gmail.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                {content.designedBy}
                <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                  EM
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
