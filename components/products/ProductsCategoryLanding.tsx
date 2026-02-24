'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Megaphone,
  Video,
  ShieldCheck,
  Radio,
  Waves,
  Network,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface CategoryChild {
  name: string
  slug: string
}

interface ProductCategory {
  name: string
  slug: string
  description: string
  icon: LucideIcon
  gradient: string
  iconBg: string
  iconColor: string
  accentColor: string
  children: CategoryChild[]
}

const categories: ProductCategory[] = [
  {
    name: 'PAGA & Industrial Intercom Systems',
    slug: 'paga',
    description:
      'Complete public address, general alarm, and industrial intercom solutions designed for mission-critical and hazardous environments.',
    icon: Megaphone,
    gradient: 'from-blue-600 to-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accentColor: 'border-blue-500',
    children: [
      { name: 'Public Address & General Alarm', slug: 'public-address-general-alarm' },
      { name: 'Industrial Intercom Systems', slug: 'industrial-intercom-systems' },
      { name: 'Speakers & Siren', slug: 'speakers-siren' },
    ],
  },
  {
    name: 'Industrial CCTV & Video Surveillance',
    slug: 'cctv',
    description:
      'Advanced video surveillance systems including fixed, PTZ, and explosion-proof cameras for industrial and critical infrastructure.',
    icon: Video,
    gradient: 'from-slate-700 to-slate-900',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    accentColor: 'border-slate-500',
    children: [
      { name: 'Fixed & PTZ Cameras', slug: 'fixed-ptz-cameras' },
      { name: 'Explosion Proof Cameras', slug: 'explosion-proof-cameras' },
      { name: 'Video Management System', slug: 'video-management-system' },
    ],
  },
  {
    name: 'Perimeter Security & Radar System',
    slug: 'radar-surveillance-system',
    description:
      '360-degree perimeter radars, intrusion detection, and integrated radar-CCTV security solutions for critical sites.',
    icon: ShieldCheck,
    gradient: 'from-emerald-600 to-emerald-800',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    accentColor: 'border-emerald-500',
    children: [
      { name: 'Perimeter Radars 360\u00B0', slug: 'perimeter-radars' },
      { name: 'Intrusion Detection Systems', slug: 'intrusion-detection-systems' },
      { name: 'Radar & CCTV Integration', slug: 'radar-cctv-integration' },
    ],
  },
  {
    name: 'Radio Communication',
    slug: 'radio',
    description:
      'Mission-critical TETRA and DMR digital radio systems with advanced dispatching solutions for public safety and enterprise.',
    icon: Radio,
    gradient: 'from-amber-600 to-orange-700',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    accentColor: 'border-amber-500',
    children: [
      { name: 'TETRA Systems', slug: 'tetra' },
      { name: 'DMR Radio System', slug: 'dmr' },
      { name: 'Dispatching Solutions', slug: 'dispatching-solutions' },
    ],
  },
  {
    name: 'Microwave Communication System',
    slug: 'microwave',
    description:
      'High-capacity point-to-point and point-to-multipoint microwave communication links for telecom and enterprise networks.',
    icon: Waves,
    gradient: 'from-purple-600 to-purple-800',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    accentColor: 'border-purple-500',
    children: [
      { name: 'PtP Microwave Links', slug: 'ptp-microwave-links' },
      { name: 'PtMP Solutions', slug: 'ptmp' },
    ],
  },
  {
    name: 'Optical Transport & Fiber Network',
    slug: 'otn-fiber',
    description:
      'Cutting-edge OTN/DWDM systems, fiber optic infrastructure, and optical transmission solutions for ultra-high-capacity networks.',
    icon: Network,
    gradient: 'from-cyan-600 to-teal-700',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    accentColor: 'border-cyan-500',
    children: [
      { name: 'OTN Systems', slug: 'otn-systems' },
      { name: 'SDH/Legacy Integration', slug: 'sdh-legacy-integration' },
      { name: 'Fiber Optic Infrastructure', slug: 'fiber-optic-infrastructure' },
      { name: 'Optical Transmission Solutions', slug: 'optical-transmission-solutions' },
    ],
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function ProductsCategoryLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative container mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm text-slate-300 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Telecommunications & Security Solutions
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Our Product
              <span className="text-primary"> Categories</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore our comprehensive range of enterprise-grade telecommunications,
              security, and surveillance solutions for critical infrastructure.
            </p>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="relative">
          <svg
            viewBox="0 0 1440 56"
            fill="none"
            className="w-full text-slate-50"
            preserveAspectRatio="none"
          >
            <path
              d="M0 56V24C240 0 480 0 720 24C960 48 1200 48 1440 24V56H0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div key={category.slug} variants={cardVariants}>
                <Link
                  href={`/products/category/${category.slug}`}
                  className="group block h-full"
                >
                  <div
                    className={`relative h-full bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-slate-200/50 group-hover:border-slate-300 group-hover:-translate-y-1`}
                  >
                    {/* Top Accent Bar */}
                    <div className={`h-1 bg-gradient-to-r ${category.gradient}`} />

                    <div className="p-6 lg:p-8">
                      {/* Icon & Title */}
                      <div className="flex items-start gap-4 mb-5">
                        <div
                          className={`flex-shrink-0 w-14 h-14 ${category.iconBg} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                        >
                          <Icon className={`w-7 h-7 ${category.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">
                        {category.description}
                      </p>

                      {/* Subcategories */}
                      <div className="space-y-2 mb-6">
                        {category.children.map((child) => (
                          <div
                            key={child.slug}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <ChevronRight
                              className={`w-3.5 h-3.5 flex-shrink-0 ${category.iconColor} opacity-60`}
                            />
                            <span>{child.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary pt-4 border-t border-slate-100">
                        <span>Explore Solutions</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Bottom CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 lg:p-16"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />

          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need Help Choosing the Right Solution?
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Our team of experts is ready to help you find the perfect
              telecommunications and security solution for your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Contact Our Experts
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-all"
              >
                View Our Solutions
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
