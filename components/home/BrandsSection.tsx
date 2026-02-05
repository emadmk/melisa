'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const brands = [
  {
    name: 'Avigilon',
    slug: 'avigilon',
    description: 'Avigilon is a company that offers a range of surveillance and security products',
    image: '/images/Avignon-image.webp',
    bgColor: 'bg-white',
  },
  {
    name: 'Motorola',
    slug: 'motorola',
    description: 'Motorola offers a range of wireless DMR (Digital Mobile Radio) products',
    image: '/images/Motorola-image.webp',
    bgColor: 'bg-primary',
    textColor: 'text-white',
  },
  {
    name: 'Cambium Networks',
    slug: 'cambium-networks',
    description: 'Cambium Networks is a global leading provider of wireless broadband solutions that connect the unconnected.',
    image: '/images/Cambium-Networks-image.webp',
    bgColor: 'bg-[#4a9fd4]',
    textColor: 'text-white',
  },
  {
    name: 'SIAE microelettronica',
    slug: 'siae-microelettronica',
    description: 'SIAE microelettronica is an Italian company specializing in wireless communication technology, exclusively designing and manufacturing wireless communication systems.',
    image: '/images/SIAE-microelettronica-image.webp',
    bgColor: 'bg-primary',
    textColor: 'text-white',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function BrandsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.slug}
              variants={itemVariants}
              className={`${brand.bgColor} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex flex-col sm:flex-row h-full min-h-[200px]">
                {/* Text Content */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <h3 className={`text-xl lg:text-2xl font-bold mb-2 ${brand.textColor || 'text-primary'}`}>
                    {brand.name}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-3 ${brand.textColor ? 'text-white/80' : 'text-gray-600'}`}>
                    {brand.description}
                  </p>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className={`inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all ${brand.textColor || 'text-primary'}`}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {/* Image */}
                <div className="relative w-full sm:w-44 lg:w-52 h-40 sm:h-auto flex-shrink-0 bg-white">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain p-3"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
