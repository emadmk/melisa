'use client'

import { motion } from 'framer-motion'

export default function WhoWeAreSection() {
  return (
    <section className="py-16 lg:py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
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
              <strong className="text-white">Radio:</strong> We provide radio communication products, including handheld radios, mobile radios, and base station radios. Our products are designed for a variety of industries, including public safety, transportation, and hospitality.
            </p>
            <p>
              <strong className="text-white">CCTV:</strong> We offer a range of CCTV products, including cameras, video recorders, and monitoring software. Our products are designed to provide high-quality surveillance and enhance security in a variety of settings.
            </p>
            <p>
              <strong className="text-white">Paging:</strong> We offer paging products, including pagers and paging systems. Our products are designed to provide reliable communication and messaging systems in a variety of industries, including healthcare and hospitality.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
