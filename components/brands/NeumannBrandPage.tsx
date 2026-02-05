'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

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
function NeumannProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-gradient-to-b from-zinc-900 to-black rounded-lg overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-500"
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-black p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <Image
            src={product.image || '/images/placeholder-product.webp'}
            alt={product.titleEn || product.titleFa}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-500 z-20" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        {product.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded">
            {product.category.nameFa}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
            {product.titleEn || product.titleFa}
          </h3>
        </Link>

        {/* Description */}
        {product.shortDesc && (
          <p className="text-zinc-400 text-sm line-clamp-2">
            {product.shortDesc}
          </p>
        )}

        {/* Action Button */}
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-orange-500 text-sm font-medium hover:text-orange-400 transition-colors mt-2"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

// Loading Screen with Melisa Logo
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
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
            src="/images/logo.webp"
            alt="Melisa"
            width={200}
            height={60}
            className="mx-auto"
          />
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mx-auto"
        />

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-gray-500 text-sm"
        >
          Entering NEUMANN Experience...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function NeumannBrandPage({ brand, products, categories, total }: NeumannBrandPageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.slug === selectedCategory)
    : products

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="min-h-screen bg-black"
      >
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

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
                  {brand.logo && (
                    <div className="relative w-64 h-20 mb-8 mx-auto lg:mx-0">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain object-left"
                        unoptimized
                      />
                    </div>
                  )}

                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    Professional
                    <span className="block text-orange-500">Communication Systems</span>
                  </h1>

                  <p className="text-zinc-400 text-lg max-w-xl">
                    IP-compatible intercom systems for industrial environments.
                    Unlimited modular decentralized system structure with optimum speech quality.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                    <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                      <span className="text-orange-500 font-bold text-2xl">{total}</span>
                      <span className="text-zinc-500 text-sm block">Products</span>
                    </div>
                    <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                      <span className="text-orange-500 font-bold text-2xl">{categories.length}</span>
                      <span className="text-zinc-500 text-sm block">Categories</span>
                    </div>
                    <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
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
        <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-sm border-y border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Back to Melisa */}
              <Link
                href="/brands"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to All Brands</span>
              </Link>

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
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                >
                  <NeumannProductCard product={product} />
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
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer Brand Bar */}
        <div className="bg-zinc-900 border-t border-zinc-800 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src="/images/logo.webp"
                  alt="Melisa"
                  width={100}
                  height={30}
                  className="opacity-50"
                />
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-500 text-sm">Official NEUMANN Distributor in UAE</span>
              </div>
              {brand.logo && (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={40}
                  className="opacity-50"
                  unoptimized
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
