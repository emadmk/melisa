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

// Product categories based on Melisa structure
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
  { name: 'Brand', href: '/brands', hasMegaMenu: 'brands' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Customer Service', href: 'https://crm.melisa.ae/', external: true },
]

const navigationAr = [
  { name: 'الرئيسية', href: '/ar' },
  { name: 'المنتجات', href: '/ar/products', hasMegaMenu: 'products' },
  { name: 'العلامات التجارية', href: '/ar/brands', hasMegaMenu: 'brands' },
  { name: 'خدماتنا', href: '/ar/services' },
  { name: 'المدونة', href: '/ar/blog' },
  { name: 'من نحن', href: '/ar/about' },
  { name: 'اتصل بنا', href: '/ar/contact' },
  { name: 'خدمة العملاء', href: 'https://crm.melisa.ae/', external: true },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [openSubSubmenu, setOpenSubSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get locale from context or pathname
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
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Phone */}
            <a
              href={`tel:${siteConfig.phone}`}
              onClick={handlePhoneClick}
              className="flex items-center gap-2 hover:text-gray-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{siteConfig.phone}</span>
            </a>

            {/* Social & Language */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>

              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div
        className={cn(
          'bg-primary transition-all duration-300',
          isScrolled ? 'shadow-lg' : ''
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/melisa-logo.webp"
                alt="Melisa"
                width={50}
                height={50}
                className="h-10 w-auto"
                priority
              />
              <span className="text-white text-2xl font-bold tracking-widest">
                M E L I S A
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
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded text-white/90 hover:text-white hover:bg-white/10"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded',
                        pathname === item.href || pathname.startsWith(item.href + '/')
                          ? 'text-white bg-white/10'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      )}
                    >
                      {item.name}
                      {item.hasMegaMenu && (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </Link>
                  )}

                  {/* Products Mega Menu */}
                  <AnimatePresence>
                    {item.hasMegaMenu === 'products' && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "absolute top-full pt-2",
                          isArabic ? "right-0" : "left-0"
                        )}
                      >
                        <div className="bg-white rounded-lg shadow-dropdown p-2 min-w-[200px] border border-gray-100">
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
                                  "flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-primary-light rounded transition-colors",
                                  isArabic && "flex-row-reverse"
                                )}
                              >
                                {category.name}
                                {category.children && <ChevronRight className={cn("w-4 h-4", isArabic && "rotate-180")} />}
                              </Link>

                              {/* Submenu Level 2 */}
                              <AnimatePresence>
                                {category.children && openSubmenu === category.slug && (
                                  <motion.div
                                    initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: isArabic ? 10 : -10 }}
                                    transition={{ duration: 0.15 }}
                                    className={cn(
                                      "absolute top-0",
                                      isArabic ? "right-full mr-1" : "left-full ml-1"
                                    )}
                                  >
                                    <div className="bg-white rounded-lg shadow-dropdown p-2 min-w-[180px] border border-gray-100">
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
                                              "flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary-light rounded transition-colors",
                                              isArabic && "flex-row-reverse"
                                            )}
                                          >
                                            {child.name}
                                            {child.children && <ChevronRight className={cn("w-4 h-4", isArabic && "rotate-180")} />}
                                          </Link>

                                          {/* Submenu Level 3 */}
                                          <AnimatePresence>
                                            {child.children && openSubSubmenu === child.slug && (
                                              <motion.div
                                                initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: isArabic ? 10 : -10 }}
                                                transition={{ duration: 0.15 }}
                                                className={cn(
                                                  "absolute top-0",
                                                  isArabic ? "right-full mr-1" : "left-full ml-1"
                                                )}
                                              >
                                                <div className="bg-white rounded-lg shadow-dropdown p-2 min-w-[160px] border border-gray-100">
                                                  {child.children.map((subChild) => (
                                                    <Link
                                                      key={subChild.slug}
                                                      href={`${basePath}/products/category/${subChild.slug}`}
                                                      className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary-light rounded transition-colors"
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "absolute top-full pt-2 w-56",
                          isArabic ? "right-0" : "left-0"
                        )}
                      >
                        <div className="bg-white rounded-lg shadow-dropdown py-2 border border-gray-100">
                          {brands.map((brand) => (
                            <Link
                              key={brand.slug}
                              href={`${basePath}/brands/${brand.slug}`}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-primary-light transition-colors"
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 rounded-lg font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary-light text-primary'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Mobile Products Menu */}
                  {item.hasMegaMenu === 'products' && (
                    <div className={cn(
                      "mt-1 space-y-1 border-primary-light",
                      isArabic ? "mr-4 border-r-2 pr-4" : "ml-4 border-l-2 pl-4"
                    )}>
                      {productCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`${basePath}/products/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Mobile Brands Menu */}
                  {item.hasMegaMenu === 'brands' && (
                    <div className={cn(
                      "mt-1 space-y-1 border-primary-light",
                      isArabic ? "mr-4 border-r-2 pr-4" : "ml-4 border-l-2 pl-4"
                    )}>
                      {brands.map((brand) => (
                        <Link
                          key={brand.slug}
                          href={`${basePath}/brands/${brand.slug}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Phone */}
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={handlePhoneClick}
                className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg mt-4"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">{siteConfig.phone}</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
