'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  ChevronRight,
  Linkedin,
  Instagram,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/seo'
import { trackPhoneClick } from '@/lib/analytics'
import { LanguageSwitcher } from '@/components/common'
import { useLocale } from '@/lib/i18n/LocaleContext'

// Product categories
const productCategoriesEn = [
  {
    name: 'PAGA',
    slug: 'paga',
    children: [
      {
        name: 'Controllers & System Modules',
        slug: 'controllers-system-modules',
        children: [
          { name: 'DS-6', slug: 'ds-6-controllers' },
          { name: 'DS-22', slug: 'ds-22-controllers' },
        ]
      },
      {
        name: 'Call Stations',
        slug: 'call-stations',
        children: [
          { name: 'DS-6', slug: 'ds-6-call-stations' },
          { name: 'DS-22', slug: 'ds-22-call-stations' },
        ]
      },
      { name: 'Speakers & Siren', slug: 'speakers-siren' },
      { name: 'Software', slug: 'paga-software' },
    ],
  },
  {
    name: 'Radio',
    slug: 'radio',
    children: [
      {
        name: 'DMR',
        slug: 'dmr',
        children: [
          { name: 'MOTOTRBO', slug: 'mototrbo' }
        ]
      },
      { name: 'TETRA', slug: 'tetra' },
      {
        name: 'Project 25 Radios',
        slug: 'project-25-radios',
        children: [
          { name: 'Mobile Radios', slug: 'mobile-radios' },
          { name: 'Portable Radios', slug: 'portable-radios' },
          { name: 'Discontinued', slug: 'discontinued' },
        ]
      },
    ],
  },
  {
    name: 'Microwave',
    slug: 'microwave',
    children: [
      { name: 'Hardware Products', slug: 'hardware-products' },
      { name: 'Software Products', slug: 'software-products' },
    ],
  },
  {
    name: 'Wireless',
    slug: 'wireless',
    children: [
      { name: 'Point to Point', slug: 'point-to-point' },
      { name: 'Point to Multipoint', slug: 'point-to-multipoint' },
      { name: 'WLAN', slug: 'wlan' },
      { name: 'MESH', slug: 'mesh' },
    ],
  },
  {
    name: 'CCTV',
    slug: 'cctv',
    children: [
      { name: 'Access Control', slug: 'access-control' },
      { name: 'Security Cameras', slug: 'security-cameras' },
    ],
  },
  {
    name: 'Radar Surveillance System',
    slug: 'radar-surveillance-system',
  },
]

const productCategoriesAr = [
  {
    name: 'أنظمة النداء العام',
    slug: 'paga',
    children: [
      {
        name: 'وحدات التحكم والنظام',
        slug: 'controllers-system-modules',
        children: [
          { name: 'DS-6', slug: 'ds-6-controllers' },
          { name: 'DS-22', slug: 'ds-22-controllers' },
        ]
      },
      {
        name: 'محطات الاتصال',
        slug: 'call-stations',
        children: [
          { name: 'DS-6', slug: 'ds-6-call-stations' },
          { name: 'DS-22', slug: 'ds-22-call-stations' },
        ]
      },
      { name: 'مكبرات الصوت والصفارات', slug: 'speakers-siren' },
      { name: 'البرمجيات', slug: 'paga-software' },
    ],
  },
  {
    name: 'الراديو',
    slug: 'radio',
    children: [
      {
        name: 'DMR',
        slug: 'dmr',
        children: [
          { name: 'MOTOTRBO', slug: 'mototrbo' }
        ]
      },
      { name: 'TETRA', slug: 'tetra' },
      {
        name: 'راديو المشروع 25',
        slug: 'project-25-radios',
        children: [
          { name: 'الراديو المتنقل', slug: 'mobile-radios' },
          { name: 'الراديو المحمول', slug: 'portable-radios' },
          { name: 'منتجات متوقفة', slug: 'discontinued' },
        ]
      },
    ],
  },
  {
    name: 'الميكروويف',
    slug: 'microwave',
    children: [
      { name: 'المنتجات المادية', slug: 'hardware-products' },
      { name: 'المنتجات البرمجية', slug: 'software-products' },
    ],
  },
  {
    name: 'اللاسلكي',
    slug: 'wireless',
    children: [
      { name: 'نقطة إلى نقطة', slug: 'point-to-point' },
      { name: 'نقطة إلى متعدد', slug: 'point-to-multipoint' },
      { name: 'شبكة محلية لاسلكية', slug: 'wlan' },
      { name: 'شبكة MESH', slug: 'mesh' },
    ],
  },
  {
    name: 'كاميرات المراقبة',
    slug: 'cctv',
    children: [
      { name: 'التحكم في الوصول', slug: 'access-control' },
      { name: 'كاميرات الأمن', slug: 'security-cameras' },
    ],
  },
  {
    name: 'نظام مراقبة الرادار',
    slug: 'radar-surveillance-system',
  },
]

const brands = [
  { name: 'Avigilon', slug: 'avigilon' },
  { name: 'Cambium Networks', slug: 'cambium-networks' },
  { name: 'Motorola', slug: 'motorola' },
  { name: 'SIAE Microelettronica', slug: 'siae-microelettronica' },
  { name: 'Industronic', slug: 'industronic' },
  { name: 'NEUMANN', slug: 'neumann' },
]

const navigationEn = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products', hasMegaMenu: 'products' },
  { name: 'Brands', href: '/brands', hasMegaMenu: 'brands' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const navigationAr = [
  { name: 'الرئيسية', href: '/ar' },
  { name: 'المنتجات', href: '/ar/products', hasMegaMenu: 'products' },
  { name: 'العلامات التجارية', href: '/ar/brands', hasMegaMenu: 'brands' },
  { name: 'خدماتنا', href: '/ar/services' },
  { name: 'المدونة', href: '/ar/blog' },
  { name: 'من نحن', href: '/ar/about' },
  { name: 'اتصل بنا', href: '/ar/contact' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [openSubSubmenu, setOpenSubSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar' || pathname.startsWith('/ar')
  const navigation = isArabic ? navigationAr : navigationEn
  const productCategories = isArabic ? productCategoriesAr : productCategoriesEn
  const basePath = isArabic ? '/ar' : ''

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setOpenDropdown(itemName)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
      setOpenSubmenu(null)
      setOpenSubSubmenu(null)
    }, 150)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
    setOpenSubmenu(null)
    setOpenSubSubmenu(null)
  }, [pathname])

  const handlePhoneClick = () => {
    trackPhoneClick()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Sleek Dark */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={handlePhoneClick}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{siteConfig.phone}</span>
              </a>
            </div>

            {/* Right Side - Social & Language */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>

              <div className="w-px h-4 bg-slate-700 hidden sm:block" />

              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Modern Glass Effect */}
      <div
        className={cn(
          'transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200'
            : 'bg-white border-b border-slate-100'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/melisa-logo.webp"
                alt="Melisa"
                width={44}
                height={44}
                className="h-10 w-auto"
                priority
              />
              <span className="text-slate-900 text-xl font-bold tracking-[0.2em] group-hover:text-primary transition-colors">
                MELISA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && handleMouseEnter(item.name)}
                  onMouseLeave={() => item.hasMegaMenu && handleMouseLeave()}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-all flex items-center gap-1 rounded-lg',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-primary bg-primary/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    {item.name}
                    {item.hasMegaMenu && (
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 transition-transform",
                        openDropdown === item.name && "rotate-180"
                      )} />
                    )}
                  </Link>

                  {/* Products Mega Menu */}
                  <AnimatePresence>
                    {item.hasMegaMenu === 'products' && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute top-full pt-2",
                          isArabic ? "right-0" : "left-0"
                        )}
                      >
                        <div className="bg-white rounded-xl shadow-xl p-2 min-w-[220px] border border-slate-100">
                          {productCategories.map((category) => (
                            <div
                              key={category.slug}
                              className="relative"
                              onMouseEnter={() => category.children && setOpenSubmenu(category.slug)}
                              onMouseLeave={() => setOpenSubmenu(null)}
                            >
                              <Link
                                href={`${basePath}/products/category/${category.slug}`}
                                className={cn(
                                  "flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors",
                                  isArabic && "flex-row-reverse"
                                )}
                              >
                                {category.name}
                                {category.children && <ChevronRight className={cn("w-4 h-4 text-slate-400", isArabic && "rotate-180")} />}
                              </Link>

                              {/* Submenu Level 2 */}
                              <AnimatePresence>
                                {category.children && openSubmenu === category.slug && (
                                  <motion.div
                                    initial={{ opacity: 0, x: isArabic ? 8 : -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: isArabic ? 8 : -8 }}
                                    transition={{ duration: 0.1 }}
                                    className={cn(
                                      "absolute top-0",
                                      isArabic ? "right-full mr-1" : "left-full ml-1"
                                    )}
                                  >
                                    <div className="bg-white rounded-xl shadow-xl p-2 min-w-[200px] border border-slate-100">
                                      {category.children.map((child) => (
                                        <div
                                          key={child.slug}
                                          className="relative"
                                          onMouseEnter={() => child.children && setOpenSubSubmenu(child.slug)}
                                          onMouseLeave={() => !child.children && setOpenSubSubmenu(null)}
                                        >
                                          <Link
                                            href={`${basePath}/products/category/${child.slug}`}
                                            className={cn(
                                              "flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors",
                                              isArabic && "flex-row-reverse"
                                            )}
                                          >
                                            {child.name}
                                            {child.children && <ChevronRight className={cn("w-4 h-4 text-slate-400", isArabic && "rotate-180")} />}
                                          </Link>

                                          {/* Submenu Level 3 */}
                                          <AnimatePresence>
                                            {child.children && openSubSubmenu === child.slug && (
                                              <motion.div
                                                initial={{ opacity: 0, x: isArabic ? 8 : -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: isArabic ? 8 : -8 }}
                                                transition={{ duration: 0.1 }}
                                                className={cn(
                                                  "absolute top-0",
                                                  isArabic ? "right-full mr-1" : "left-full ml-1"
                                                )}
                                              >
                                                <div className="bg-white rounded-xl shadow-xl p-2 min-w-[180px] border border-slate-100">
                                                  {child.children.map((subChild) => (
                                                    <Link
                                                      key={subChild.slug}
                                                      href={`${basePath}/products/category/${subChild.slug}`}
                                                      className="block px-4 py-2 text-sm text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                                                    >
                                                      {subChild.name}
                                                    </Link>
                                                  ))}
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Brands Dropdown */}
                  <AnimatePresence>
                    {item.hasMegaMenu === 'brands' && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute top-full pt-2 w-56",
                          isArabic ? "right-0" : "left-0"
                        )}
                      >
                        <div className="bg-white rounded-xl shadow-xl p-2 border border-slate-100">
                          {brands.map((brand) => (
                            <Link
                              key={brand.slug}
                              href={`${basePath}/brands/${brand.slug}`}
                              className="block px-4 py-2.5 text-sm text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              {brand.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* CTA Button & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={handlePhoneClick}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                <Phone className="w-4 h-4" />
                <span>{isArabic ? 'اتصل الآن' : 'Call Now'}</span>
              </a>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block px-4 py-3 rounded-lg font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {item.name}
                  </Link>

                  {/* Mobile Products Menu */}
                  {item.hasMegaMenu === 'products' && (
                    <div className={cn(
                      "mt-1 space-y-1 border-primary/20",
                      isArabic ? "mr-4 border-r-2 pr-4" : "ml-4 border-l-2 pl-4"
                    )}>
                      {productCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`${basePath}/products/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Mobile Brands Menu */}
                  {item.hasMegaMenu === 'brands' && (
                    <div className={cn(
                      "mt-1 space-y-1 border-primary/20",
                      isArabic ? "mr-4 border-r-2 pr-4" : "ml-4 border-l-2 pl-4"
                    )}>
                      {brands.map((brand) => (
                        <Link
                          key={brand.slug}
                          href={`${basePath}/brands/${brand.slug}`}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={handlePhoneClick}
                className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-3.5 rounded-xl mt-4 font-medium"
              >
                <Phone className="w-5 h-5" />
                <span>{siteConfig.phone}</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
