'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/lib/seo'
import { trackWhatsAppClick, trackPhoneClick } from '@/lib/analytics'

export default function CtaSection() {
  const handlePhoneClick = () => {
    trackPhoneClick()
  }

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('cta_section')
  }

  return (
    <section className="relative py-20 bg-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-white mb-6"
          >
            Need Consultation?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg mb-8 leading-relaxed"
          >
            Our experts are ready to answer your questions and provide specialized consultation
            in the field of security and telecommunications equipment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={`tel:${siteConfig.phone}`}
              onClick={handlePhoneClick}
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors w-full sm:w-auto justify-center"
            >
              <Phone className="w-5 h-5" />
              <span dir="ltr">{siteConfig.phone}</span>
            </a>

            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              onClick={handleWhatsAppClick}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-green-600 transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Message on WhatsApp
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20 w-full sm:w-auto justify-center"
            >
              Contact Form
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
