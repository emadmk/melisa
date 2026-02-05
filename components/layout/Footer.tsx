'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/seo'

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'about us', href: '/about' },
  { name: 'Contact us', href: '/contact' },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo & About Section */}
          <motion.div {...fadeInUp}>
            {/* Logo */}
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/melisa-logo.webp"
                alt="Melisa"
                width={160}
                height={50}
                className="h-12 w-auto"
              />
            </Link>

            <h3 className="font-bold text-lg mb-4">About US</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              The company is involved in the CCTV field and can provide security and surveillance services using modern CCTV equipment. It also offers communication and messaging services in the paging field.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              With a strong technical expertise and experience, the company has established effective and sustainable communication with its customers and achieved excellence in the telecommunications and communication industry.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">location:</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {siteConfig.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">tell:</h4>
                  <p className="text-gray-300 text-sm">
                    <a href={`tel:${siteConfig.phone}`} className="hover:text-white transition-colors">
                      {siteConfig.phone}
                    </a>
                    <br />
                    <a href={`tel:${siteConfig.phone2}`} className="hover:text-white transition-colors">
                      {siteConfig.phone2}
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">email:</h4>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Links & Social */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className="font-bold text-lg mb-4">links</h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              Designed and implemented by Esperios
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">
                ES
              </span>
              Esperios from 89 to OO
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
