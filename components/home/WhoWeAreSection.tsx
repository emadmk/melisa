'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const partners = [
  { name: 'SIAE microelettronica', logo: '/images/partners/siae.png' },
  { name: 'Industronic', logo: '/images/partners/industronic.png' },
  { name: 'Cambium Networks', logo: '/images/partners/cambium.png' },
  { name: 'Avigilon', logo: '/images/partners/avigilon.png' },
  { name: 'Motorola', logo: '/images/partners/motorola.png' },
]

export default function WhoWeAreSection() {
  return (
    <section className="py-16 lg:py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            WHO WE ARE ?
          </h2>
          <p className="text-lg text-white/90 font-medium mb-4">
            We strive to provide high-quality and secure products that meet the needs of our customers.
          </p>
          <div className="max-w-4xl mx-auto space-y-4 text-white/80">
            <p>
              Our company offers a wide range of products in the field of telecommunications, radio, CCTV, and paging. We strive to provide high-quality and secure products that meet the needs of our customers.
            </p>
            <p>
              Telecommunications: We offer a variety of telecommunications products, including telephones, handsets, mobile phones, and base station radios. Our products are designed to enhance communication and manage efficiency in the workplace.
            </p>
            <p>
              Radio: We provide radio communication products, including handheld radios, mobile radios, and base station radios. Our products are designed for a variety of industries, including public safety, transportation, and hospitality.
            </p>
            <p>
              CCTV: We offer a range of CCTV products, including cameras, video recorders, and monitoring software. Our products are designed to provide high-quality surveillance and enhance security in a variety of settings.
            </p>
            <p>
              Paging: We offer paging products, including pagers and paging systems. Our products are designed to provide reliable communication and messaging systems in a variety of industries, including healthcare and hospitality.
            </p>
          </div>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            These Are Our Best Customers<br />
            that enjoy to work with us
          </h3>
          <p className="text-center text-white/70 text-sm mb-8">
            WE ARE GLAD TO HEAR FROM YOU
          </p>

          {/* Partner Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                whileHover={{ scale: 1.1 }}
                className="bg-white/10 rounded-lg px-6 py-4 hover:bg-white/20 transition-colors"
              >
                <div className="relative h-12 w-32">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
