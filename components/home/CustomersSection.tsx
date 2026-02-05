'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const brandLogos = [
  { name: 'SIAE microelettronica', logo: '/images/sm-logo.webp' },
  { name: 'Industronic', logo: '/images/inoustronic-logo.webp' },
  { name: 'Cambium Networks', logo: '/images/combium-network-logo.webp' },
  { name: 'Avigilon', logo: '/images/avigilon-logo.webp' },
  { name: 'Motorola', logo: '/images/motorola-logo.webp' },
]

export default function CustomersSection() {
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
          {brandLogos.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </motion.div>
          ))}
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
