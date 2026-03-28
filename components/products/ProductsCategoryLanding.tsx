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
  CheckCircle2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface CategoryChild {
  name: string
  slug: string
}

interface ProductCategory {
  name: string
  slug: string
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  iconBg: string
  iconColor: string
  features: string[]
  partners: string[]
  children: CategoryChild[]
}

const categories: ProductCategory[] = [
  {
    name: 'PAGA & Industrial Intercom',
    slug: 'paga',
    title: 'Industrial PAGA Systems for Oil & Gas Facilities',
    description:
      'MELISA provides advanced Public Address & General Alarm (PAGA) systems designed for critical communication in oil & gas, petrochemical and industrial environments. Our solutions ensure clear, reliable and real-time communication across hazardous and high-noise areas, fully compliant with international safety standards. We support EPC contractors from design stage through installation, integration and commissioning.',
    icon: Megaphone,
    gradient: 'from-amber-600 to-orange-700',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    features: [
      'High intelligibility in noisy environments',
      'Redundant and fail-safe architecture',
      'Integration with fire & gas systems',
      'Certified for hazardous areas',
    ],
    partners: ['Neumann Elektronik'],
    children: [
      { name: 'Public Address & General Alarm', slug: 'public-address-general-alarm' },
      { name: 'Industrial Intercom Systems', slug: 'industrial-intercom-systems' },
      { name: 'Speakers & Siren', slug: 'speakers-siren' },
      { name: 'Software & Functions', slug: 'paga-software-functions' },
    ],
  },
  {
    name: 'Industrial CCTV & Surveillance',
    slug: 'cctv',
    title: 'Industrial CCTV & Video Surveillance Systems',
    description:
      'MELISA delivers robust CCTV and video surveillance systems tailored for industrial and critical infrastructure applications. Our solutions include high-resolution cameras, video management systems and intelligent analytics designed to enhance security, monitoring and operational awareness. We specialize in hazardous area surveillance and integration with command & control centers.',
    icon: Video,
    gradient: 'from-slate-700 to-slate-900',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    features: [
      'HD / 4K industrial cameras',
      'Video analytics & AI detection',
      'Centralized monitoring systems',
      'Integration with access control & radar',
    ],
    partners: ['Pelco', 'Avigilon'],
    children: [
      { name: 'Fixed & PTZ Cameras', slug: 'fixed-ptz-cameras' },
      { name: 'Explosion Proof Cameras', slug: 'explosion-proof-cameras' },
      { name: 'Video Management System', slug: 'video-management-system' },
    ],
  },
  {
    name: 'Perimeter Security & Radar',
    slug: 'radar-surveillance-system',
    title: 'Perimeter Radar Security Systems for Critical Infrastructure',
    description:
      'MELISA provides advanced perimeter security solutions based on Navtech radar technology, offering continuous 360° detection and tracking in all weather and lighting conditions. Our radar systems ensure early threat detection and seamless integration with CCTV and security platforms.',
    icon: ShieldCheck,
    gradient: 'from-emerald-600 to-emerald-800',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    features: [
      '360° real-time detection',
      'Long-range intrusion monitoring',
      'Works in all weather conditions',
      'Full integration with CCTV systems',
    ],
    partners: ['Navtech Radar'],
    children: [
      { name: 'Perimeter Radars 360°', slug: 'perimeter-radars' },
      { name: 'Intrusion Detection Systems', slug: 'intrusion-detection-systems' },
      { name: 'Radar & CCTV Integration', slug: 'radar-cctv-integration' },
    ],
  },
  {
    name: 'Radio Communication',
    slug: 'radio',
    title: 'Mission-Critical Radio Communication Systems (TETRA & DMR)',
    description:
      'MELISA designs and deploys professional radio communication systems ensuring reliable voice and data communication across industrial sites. Our TETRA and DMR solutions are ideal for oil & gas operations, providing secure, scalable and mission-critical communication.',
    icon: Radio,
    gradient: 'from-blue-600 to-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    features: [
      'Wide-area communication coverage',
      'Secure and encrypted communication',
      'Dispatching & control room solutions',
      'Explosion-proof radio support',
    ],
    partners: ['Motorola Solutions'],
    children: [
      { name: 'TETRA Systems', slug: 'tetra' },
      { name: 'DMR Radio System', slug: 'dmr' },
      { name: 'Dispatching Solutions', slug: 'dispatching-solutions' },
    ],
  },
  {
    name: 'Microwave Communication',
    slug: 'microwave',
    title: 'Microwave Communication Systems for Long Distance Connectivity',
    description:
      'MELISA provides microwave communication systems for reliable long-distance connectivity where fiber deployment is not feasible. Our solutions are designed for critical communication links across remote and industrial locations.',
    icon: Waves,
    gradient: 'from-purple-600 to-purple-800',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    features: [
      'Point-to-point communication',
      'High availability links',
      'Ideal for remote areas',
      'Backup communication solutions',
    ],
    partners: ['SIAE Microelettronica', 'Cambium Networks'],
    children: [
      { name: 'PtP Microwave Links', slug: 'ptp-microwave-links' },
      { name: 'PtMP Solutions', slug: 'ptmp' },
    ],
  },
  {
    name: 'OTN & Fiber Optic Network',
    slug: 'otn-fiber',
    title: 'OTN & Fiber Optic Communication Networks',
    description:
      'MELISA delivers high-capacity optical transport networks (OTN) and fiber optic infrastructure for industrial communication systems. Our solutions ensure reliable, high-speed data transmission for critical applications across large-scale facilities.',
    icon: Network,
    gradient: 'from-cyan-600 to-teal-700',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    features: [
      'High bandwidth optical transmission',
      'Scalable network architecture',
      'Integration with legacy systems (SDH/IP)',
      'Designed for industrial environments',
    ],
    partners: [],
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
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export default function ProductsCategoryLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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

      {/* Categories */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-8"
        >
          {categories.map((category, index) => {
            const Icon = category.icon
            const isEven = index % 2 === 0

            return (
              <motion.div key={category.slug} variants={cardVariants}>
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-500">
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Left/Right: Gradient Side */}
                    <div className={`relative lg:w-[380px] xl:w-[440px] flex-shrink-0 bg-gradient-to-br ${category.gradient} p-8 sm:p-10 flex flex-col justify-between min-h-[280px] lg:min-h-[360px]`}>
                      {/* Pattern */}
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                          backgroundSize: '24px 24px',
                        }}
                      />

                      <div className="relative">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Category Name */}
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                          {category.name}
                        </h2>

                        {/* Subcategories */}
                        <div className="space-y-2">
                          {category.children.map((child) => (
                            <Link
                              key={child.slug}
                              href={`/products/category/${category.slug}`}
                              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Technology Partners */}
                      {category.partners.length > 0 && (
                        <div className="relative mt-6 pt-5 border-t border-white/20">
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Technology Partner{category.partners.length > 1 ? 's' : ''}</p>
                          <p className="text-white font-semibold text-sm">
                            {category.partners.join(' | ')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right/Left: Content Side */}
                    <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-500 leading-relaxed mb-6 text-sm sm:text-base">
                        {category.description}
                      </p>

                      {/* Key Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {category.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2.5">
                            <CheckCircle2 className={`w-4.5 h-4.5 ${category.iconColor} flex-shrink-0 mt-0.5`} />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div>
                        <Link
                          href={`/products/category/${category.slug}`}
                          className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${category.gradient} text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all group-hover:gap-3`}
                        >
                          Explore Solutions
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Bottom CTA */}
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
                View Our Services
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
