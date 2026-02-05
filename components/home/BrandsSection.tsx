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
    logo: '/images/avigilon-logo.webp',
    bgColor: 'bg-white',
  },
  {
    name: 'Motorola',
    slug: 'motorola',
    description: 'Motorola offers a range of wireless DMR (Digital Mobile Radio) products',
    image: '/images/Motorola-image.webp',
    logo: '/images/motorola-logo.webp',
    bgColor: 'bg-primary',
    textColor: 'text-white',
  },
  {
    name: 'Cambium Networks',
    slug: 'cambium-networks',
    description: 'Cambium Networks is a global leading provider of wireless broadband solutions that connect the unconnected.',
    image: '/images/Cambium-Networks-image.webp',
    logo: '/images/combium-network-logo.webp',
    bgColor: 'bg-[#4a9fd4]',
    textColor: 'text-white',
  },
  {
    name: 'SIAE microelettronica',
    slug: 'siae-microelettronica',
    description: 'SIAE microelettronica is an Italian company specializing in wireless communication technology, exclusively designing and manufacturing wireless communication systems.',
    image: '/images/SIAE-microelettronica-image.webp',
    logo: '/images/sm-logo.webp',
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
              <div className="p-6 lg:p-8">
                <h3 className={`text-2xl lg:text-3xl font-bold mb-3 ${brand.textColor || 'text-primary'}`}>
                  {brand.name}
                </h3>
                <p className={`text-sm lg:text-base mb-4 ${brand.textColor ? 'text-white/80' : 'text-gray-600'}`}>
                  {brand.description}
                </p>
                <Link
                  href={`/brands/${brand.slug}`}
                  className={`inline-flex items-center gap-2 font-medium hover:gap-3 transition-all ${brand.textColor || 'text-primary'}`}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative h-48 lg:h-64">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover"
                />
                {/* Logo overlay */}
                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain"
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
