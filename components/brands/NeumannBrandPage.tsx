'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, Menu, X, Phone, Mail } from 'lucide-react'

interface Product {
  id: string
  titleFa: string
  titleEn?: string | null
  slug: string
  shortDesc?: string | null
  image?: string | null
  category?: { nameFa: string; slug: string } | null
}

interface Category {
  name: string
  slug: string
  count: number
}

interface NeumannBrandPageProps {
  brand: {
    name: string
    slug: string
    logo?: string | null
    description?: string | null
  }
  products: Product[]
  categories: Category[]
  total: number
}

// Neumann Product Card - Dark Theme
function NeumannProductCard({ product, onNavigate }: { product: Product; onNavigate: (url: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-gradient-to-b from-zinc-900 to-black rounded-lg overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-500"
    >
      {/* Product Image */}
      <div
        onClick={() => onNavigate(`/products/${product.slug}`)}
        className="cursor-pointer"
      >
        <div className="relative aspect-square bg-black p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <Image
            src={product.image || '/images/placeholder-product.webp'}
            alt={product.titleEn || product.titleFa}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-500 z-20" />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {product.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded">
            {product.category.nameFa}
          </span>
        )}

        <div onClick={() => onNavigate(`/products/${product.slug}`)} className="cursor-pointer">
          <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
            {product.titleEn || product.titleFa}
          </h3>
        </div>

        {product.shortDesc && (
          <p className="text-zinc-400 text-sm line-clamp-2">
            {product.shortDesc}
          </p>
        )}

        <button
          onClick={() => onNavigate(`/products/${product.slug}`)}
          className="inline-flex items-center gap-2 text-orange-500 text-sm font-medium hover:text-orange-400 transition-colors mt-2"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

// Dark Header Component
function DarkHeader({ onNavigate, mobileMenuOpen, setMobileMenuOpen }: {
  onNavigate: (url: string) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}) {
  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="cursor-pointer flex items-center gap-3"
          >
            <Image
              src="/images/melisa-logo.webp"
              alt="Melisa"
              width={45}
              height={45}
              className="brightness-0 invert"
            />
            <span className="text-white font-light tracking-[0.3em] text-lg">M E L I S A</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => onNavigate('/')}
              className="text-zinc-400 hover:text-orange-500 transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('/products')}
              className="text-zinc-400 hover:text-orange-500 transition-colors font-medium"
            >
              Products
            </button>
            <button
              onClick={() => onNavigate('/brands')}
              className="text-zinc-400 hover:text-orange-500 transition-colors font-medium"
            >
              Brands
            </button>
            <button
              onClick={() => onNavigate('/services')}
              className="text-zinc-400 hover:text-orange-500 transition-colors font-medium"
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="text-zinc-400 hover:text-orange-500 transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="tel:+97143214000" className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+971 4 321 4000</span>
            </a>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-zinc-800 overflow-hidden"
            >
              <nav className="py-4 space-y-2">
                {['/', '/products', '/brands', '/services', '/contact'].map((url, i) => (
                  <button
                    key={url}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigate(url)
                    }}
                    className="block w-full text-left px-4 py-3 text-zinc-300 hover:text-orange-500 hover:bg-zinc-900 rounded-lg transition-colors"
                  >
                    {['Home', 'Products', 'Brands', 'Services', 'Contact'][i]}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

// Dark Footer Component
function DarkFooter({ onNavigate }: { onNavigate: (url: string) => void }) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/images/melisa-logo.webp"
                alt="Melisa"
                width={120}
                height={36}
                className="brightness-0 invert opacity-80"
              />
              <span className="text-zinc-700">×</span>
              <Image
                src="/images/neumann-logo-white.svg"
                alt="NEUMANN"
                width={100}
                height={30}
                className="opacity-80"
              />
            </div>
            <p className="text-zinc-500 mb-6 max-w-md">
              Official distributor of NEUMANN Elektronik products in the UAE.
              Providing professional communication and PA systems for industrial environments.
            </p>
            <div className="flex items-center gap-4">
              <a href="tel:+97143214000" className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors">
                <Phone className="w-5 h-5" />
                <span>+971 4 321 4000</span>
              </a>
              <a href="mailto:info@melisa.ae" className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@melisa.ae</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Products', url: '/products' },
                { label: 'All Brands', url: '/brands' },
                { label: 'Services', url: '/services' },
                { label: 'About Us', url: '/about' },
                { label: 'Contact', url: '/contact' },
              ].map(link => (
                <li key={link.url}>
                  <button
                    onClick={() => onNavigate(link.url)}
                    className="text-zinc-500 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* NEUMANN Products */}
          <div>
            <h4 className="text-white font-semibold mb-4">NEUMANN Systems</h4>
            <ul className="space-y-2 text-zinc-500">
              <li>PAGA Systems</li>
              <li>IP Intercom</li>
              <li>Call Stations</li>
              <li>Speakers & Horns</li>
              <li>Control Panels</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-zinc-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-sm">
              © {new Date().getFullYear()} Melisa Trading LLC. All rights reserved.
            </p>
            <p className="text-zinc-600 text-sm">
              NEUMANN Elektronik - Official UAE Distributor
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Loading Screen with Melisa Logo
function LoadingScreen({ onComplete, isExiting = false }: { onComplete: () => void; isExiting?: boolean }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, isExiting ? 1500 : 2500)
    return () => clearTimeout(timer)
  }, [onComplete, isExiting])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        isExiting ? 'bg-black' : 'bg-white'
      }`}
    >
      <div className="text-center">
        {/* Melisa Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Image
            src="/images/melisa-logo.webp"
            alt="Melisa"
            width={200}
            height={60}
            className={`mx-auto ${isExiting ? 'brightness-0 invert' : ''}`}
          />
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ duration: isExiting ? 1 : 2, ease: 'easeInOut' }}
          className={`h-1 rounded-full mx-auto ${
            isExiting
              ? 'bg-gradient-to-r from-orange-500 to-primary'
              : 'bg-gradient-to-r from-primary to-orange-500'
          }`}
        />

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 text-sm ${isExiting ? 'text-zinc-500' : 'text-gray-500'}`}
        >
          {isExiting ? 'Returning to Melisa...' : 'Entering NEUMANN Experience...'}
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function NeumannBrandPage({ products, categories, total }: NeumannBrandPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [exitUrl, setExitUrl] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.slug === selectedCategory)
    : products

  // Handle navigation with exit animation
  const handleNavigate = useCallback((url: string) => {
    // Check if navigating away from Neumann page
    if (!url.includes('/brands/neumann')) {
      setExitUrl(url)
      setIsExiting(true)
    } else {
      router.push(url)
    }
  }, [router])

  // Navigate after exit animation completes
  const handleExitComplete = useCallback(() => {
    if (exitUrl) {
      router.push(exitUrl)
    }
  }, [exitUrl, router])

  return (
    <>
      {/* Entry Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Exit Loading Screen */}
      <AnimatePresence>
        {isExiting && <LoadingScreen onComplete={handleExitComplete} isExiting />}
      </AnimatePresence>

      {/* Main Content - Fixed position to cover default layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed inset-0 z-[60] bg-black overflow-y-auto"
      >
        {/* Dark Header */}
        <DarkHeader
          onNavigate={handleNavigate}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Orange Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 py-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Brand Info */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {/* Neumann Logo */}
                  <div className="relative w-64 h-16 mb-8 mx-auto lg:mx-0">
                    <Image
                      src="/images/neumann-logo-white.svg"
                      alt="NEUMANN"
                      fill
                      className="object-contain object-left"
                    />
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    Professional
                    <span className="block text-orange-500">Communication Systems</span>
                  </h1>

                  <p className="text-zinc-400 text-lg max-w-xl">
                    IP-compatible intercom systems for industrial environments.
                    Unlimited modular decentralized system structure with optimum speech quality.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                    <div className="px-4 py-3 bg-zinc-900/80 rounded-lg border border-zinc-800 backdrop-blur-sm">
                      <span className="text-orange-500 font-bold text-2xl">{total}</span>
                      <span className="text-zinc-500 text-sm block">Products</span>
                    </div>
                    <div className="px-4 py-3 bg-zinc-900/80 rounded-lg border border-zinc-800 backdrop-blur-sm">
                      <span className="text-orange-500 font-bold text-2xl">{categories.length}</span>
                      <span className="text-zinc-500 text-sm block">Categories</span>
                    </div>
                    <div className="px-4 py-3 bg-zinc-900/80 rounded-lg border border-zinc-800 backdrop-blur-sm">
                      <span className="text-orange-500 font-bold text-2xl">12kHz</span>
                      <span className="text-zinc-500 text-sm block">Speech Quality</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Featured Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.9 : 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="relative w-full max-w-md"
              >
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
                  {products[0]?.image && (
                    <Image
                      src={products[0].image}
                      alt="Featured Product"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="bg-zinc-900/95 backdrop-blur-sm border-y border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Back to Melisa */}
              <button
                onClick={() => handleNavigate('/brands')}
                className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to All Brands</span>
              </button>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition-colors"
                >
                  <span>{selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Categories'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden z-50"
                    >
                      <button
                        onClick={() => {
                          setSelectedCategory(null)
                          setShowCategoryDropdown(false)
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-zinc-700 transition-colors ${
                          !selectedCategory ? 'text-orange-500' : 'text-white'
                        }`}
                      >
                        All Categories ({total})
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.slug}
                          onClick={() => {
                            setSelectedCategory(cat.slug)
                            setShowCategoryDropdown(false)
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-zinc-700 transition-colors ${
                            selectedCategory === cat.slug ? 'text-orange-500' : 'text-white'
                          }`}
                        >
                          {cat.name} ({cat.count})
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              {selectedCategory
                ? `${categories.find(c => c.slug === selectedCategory)?.name} Products`
                : 'All Products'
              }
              <span className="text-zinc-500 font-normal ml-2">({filteredProducts.length})</span>
            </h2>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.05, duration: 0.5 }}
                >
                  <NeumannProductCard product={product} onNavigate={handleNavigate} />
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500 text-lg">No products found in this category</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-b from-black to-zinc-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Need Help Choosing the Right Product?
            </h3>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
              Our technical team is ready to help you find the perfect communication solution for your industrial environment.
            </p>
            <button
              onClick={() => handleNavigate('/contact')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dark Footer */}
        <DarkFooter onNavigate={handleNavigate} />
      </motion.div>
    </>
  )
}
