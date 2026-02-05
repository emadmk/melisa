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
  Globe,
  Linkedin,
  Instagram,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/seo'
import { trackPhoneClick } from '@/lib/analytics'

// Product categories based on Melisa screenshot
const productCategories = [
  {
    name: 'PAGA',
    slug: 'paga',
  },
  {
    name: 'Radio',
    slug: 'radio',
    children: [
      { name: 'DMR', slug: 'dmr', children: [{ name: 'MOTOTRBO', slug: 'mototrbo' }] },
      { name: 'TETRA', slug: 'tetra' },
      { name: 'Project 25 Radios', slug: 'project-25-radios' },
    ],
  },
  {
    name: 'Microwave',
    slug: 'microwave',
  },
  {
    name: 'Wireless',
    slug: 'wireless',
  },
  {
    name: 'CCTV',
    slug: 'cctv',
  },
  {
    name: 'Radar surveillance system',
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

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Product', href: '/products', hasMegaMenu: 'products' },
  { name: 'brand', href: '/brands', hasMegaMenu: 'brands' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'about us', href: '/about' },
  { name: 'Contact us', href: '/contact' },
  { name: 'customer service', href: '/customer-service' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

              <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                <button className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>العربية(Arabic)</span>
                </button>
                <span className="text-white/40">|</span>
                <button className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                  <span>English</span>
                </button>
              </div>
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
            <Link href="/" className="flex items-center">
              <Image
                src="/uploads/melisa-logo.webp"
                alt="Melisa"
                width={160}
                height={50}
                className="h-12 w-auto"
                priority
              />
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

                  {/* Products Mega Menu */}
                  <AnimatePresence>
                    {item.hasMegaMenu === 'products' && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 pt-2"
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
                                href={`/products/category/${category.slug}`}
                                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-primary-light rounded transition-colors"
                              >
                                {category.name}
                                {category.children && <ChevronRight className="w-4 h-4" />}
                              </Link>

                              {/* Submenu */}
                              <AnimatePresence>
                                {category.children && openSubmenu === category.slug && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-full top-0 ml-1"
                                  >
                                    <div className="bg-white rounded-lg shadow-dropdown p-2 min-w-[180px] border border-gray-100">
                                      {category.children.map((child) => (
                                        <div key={child.slug}>
                                          <Link
                                            href={`/products/category/${child.slug}`}
                                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary-light rounded transition-colors"
                                          >
                                            {child.name}
                                            {child.children && <ChevronRight className="w-4 h-4" />}
                                          </Link>
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
                        className="absolute top-full left-0 pt-2 w-56"
                      >
                        <div className="bg-white rounded-lg shadow-dropdown py-2 border border-gray-100">
                          {brands.map((brand) => (
                            <Link
                              key={brand.slug}
                              href={`/brands/${brand.slug}`}
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

                  {/* Mobile Products Menu */}
                  {item.hasMegaMenu === 'products' && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary-light pl-4">
                      {productCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/products/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Mobile Brands Menu */}
                  {item.hasMegaMenu === 'brands' && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary-light pl-4">
                      {brands.map((brand) => (
                        <Link
                          key={brand.slug}
                          href={`/brands/${brand.slug}`}
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
