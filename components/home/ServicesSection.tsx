'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'Equipment supply',
    slug: 'equipment-supply',
    description: 'The company provides a wide range of high-quality equipment as per the needs of its clients. This includes telecommunications, radio, and security equipment.',
    image: '/images/services/equipment-supply.jpg',
  },
  {
    id: 2,
    title: 'Engineering',
    slug: 'engineering',
    description: 'The company offers a range of engineering services, including design, development, and implementation of customized solutions to meet the specific needs of its clients.',
    image: '/images/services/engineering.jpg',
  },
  {
    id: 3,
    title: 'Commissioning',
    slug: 'commissioning',
    description: 'The company uses commission equipment to ensure that it is operating correctly with a fully integrated into a client\'s system.',
    image: '/images/services/commissioning.jpg',
  },
  {
    id: 4,
    title: 'Installation',
    slug: 'installation',
    description: 'The company installs telecommunications and radio equipment at client site, ensuring that it is set up correctly.',
    image: '/images/services/installation.jpg',
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function ServicesSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            our services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our company offers a wide range of products in the field of telecommunications, radio, CCTV, and paging. We strive to provide high-quality and secure products that meet the needs of our customers.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-all hover:gap-3"
          >
            see all service
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
