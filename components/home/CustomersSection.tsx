'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  _count?: { products: number }
}

export default function CustomersSection() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch('/api/brands')
        const data = await response.json()
        if (data.success && data.data) {
          // Filter brands that have logos
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
            These Are Our Best Customers
          </h2>
          <p className="text-gray-600">
            that enjoy to work with us
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
            <p className="text-gray-500">No brands available</p>
          )}
        </motion.div>

        {/* CTA Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-2xl lg:text-3xl font-bold text-primary">
            WE ARE GLAD TO HEAR FROM YOU
          </p>
        </motion.div>
      </div>
    </section>
  )
}
