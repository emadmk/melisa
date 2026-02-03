'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

// Static categories with images
const staticCategories = [
  {
    id: '1',
    nameFa: 'CCTV Cameras',
    nameEn: 'CCTV',
    slug: 'cctv',
    image: '/images/cctv.webp',
    description: 'High quality security and surveillance cameras',
  },
  {
    id: '2',
    nameFa: 'Wireless Equipment',
    nameEn: 'Wireless',
    slug: 'wireless',
    image: '/images/Microwave.webp',
    description: 'Microwave and wireless communication equipment',
  },
  {
    id: '3',
    nameFa: 'Paging System',
    nameEn: 'Paging',
    slug: 'paging',
    image: '/images/paging.webp',
    description: 'Industrial announcement and paging systems',
  },
  {
    id: '4',
    nameFa: 'Wireless and Radio',
    nameEn: 'Radio',
    slug: 'radio',
    image: '/images/radio.webp',
    description: 'Professional radio and wireless equipment',
  },
  {
    id: '5',
    nameFa: 'Telecommunications',
    nameEn: 'Telecommunication',
    slug: 'access-control',
    image: '/images/telecomunication.webp',
    description: 'Telecommunications and access control equipment',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function CategoriesSection() {
  return (
    <section className="section bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Product Categories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle mx-auto"
          >
            Security and telecommunications equipment in various categories
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {staticCategories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/products/category/${category.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.nameFa}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-dark group-hover:text-primary transition-colors">
                        {category.nameFa}
                      </h3>
                      {category.nameEn && (
                        <p className="text-xs sm:text-sm text-gray-400">{category.nameEn}</p>
                      )}
                    </div>
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:-translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  {category.description && (
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 hidden sm:block">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            View All Products
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
