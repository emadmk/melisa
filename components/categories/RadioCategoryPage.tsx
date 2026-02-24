'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Radio,
  Signal,
  Shield,
  Zap,
  MapPin,
  Lock,
  ArrowRight,
  Home,
  ChevronRight,
} from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

interface RadioCategoryPageProps {
  products: {
    id: string
    titleFa: string
    titleEn?: string | null
    slug: string
    shortDesc?: string | null
    image?: string | null
    category?: { nameFa: string; slug: string } | null
    brand?: { name: string; slug: string; logo?: string | null } | null
  }[]
  totalProducts: number
}

const KEY_FEATURES = [
  {
    icon: Radio,
    title: 'TETRA Digital Trunked Radio Systems',
    subtitle: 'ETSI Standard',
    description:
      'Full-featured TETRA infrastructure delivering seamless group communication, emergency calls, and data services for mission-critical networks.',
  },
  {
    icon: Signal,
    title: 'DMR Tier II and Tier III Solutions',
    subtitle: 'MOTOTRBO',
    description:
      'Scalable digital mobile radio platforms from single-site repeaters to wide-area multi-site trunked systems with IP connectivity.',
  },
  {
    icon: Shield,
    title: 'P25 Phase 1 & Phase 2 Radios',
    subtitle: 'Public Safety Grade',
    description:
      'Interoperable P25 systems supporting FDMA and TDMA technologies for law enforcement, fire, and emergency medical services.',
  },
  {
    icon: Zap,
    title: 'Dispatch Console & Control Room Solutions',
    subtitle: 'Unified Command',
    description:
      'Advanced dispatch consoles integrating radio, telephony, and data into a unified operator interface for centralized command.',
  },
  {
    icon: MapPin,
    title: 'GPS/AVL Fleet Tracking Integration',
    subtitle: 'Real-Time Tracking',
    description:
      'Integrated automatic vehicle location and GPS tracking overlays providing real-time fleet visibility on dynamic mapping systems.',
  },
  {
    icon: Lock,
    title: 'AES-256 End-to-End Encryption',
    subtitle: 'Military-Grade Security',
    description:
      'Hardware-based AES-256 encryption ensuring secure voice and data communication that meets defense and government standards.',
  },
]

const WHY_CHOOSE = [
  {
    number: '01',
    title: 'Authorized Motorola Solutions Channel Partner',
    description:
      'Certified partner with direct access to Motorola Solutions product lines, technical resources, and factory support.',
  },
  {
    number: '02',
    title: 'Over 200 active radio networks deployed in GCC',
    description:
      'Proven track record with large-scale deployments across the Gulf region for government, energy, and transportation sectors.',
  },
  {
    number: '03',
    title: 'Licensed radio frequency planning & coordination',
    description:
      'In-house RF engineering team handling spectrum analysis, frequency coordination, and regulatory compliance.',
  },
  {
    number: '04',
    title: 'Turnkey solutions: design, supply, install, maintain',
    description:
      'Complete lifecycle management from initial site survey and system design through installation, commissioning, and ongoing maintenance.',
  },
  {
    number: '05',
    title: '24/7 network monitoring center (NOC) in UAE',
    description:
      'Dedicated Network Operations Center providing round-the-clock system monitoring, fault management, and rapid incident response.',
  },
]

// ---------------------------------------------------------------------------
// Animated radio-wave concentric circles
// ---------------------------------------------------------------------------
function RadioWaveAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-red-600/20"
          initial={{ width: 40, height: 40, opacity: 0.6 }}
          animate={{
            width: [40, 600 + i * 120],
            height: [40, 600 + i * 120],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Central pulsing dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-red-600"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Animated section wrapper (fade-up on scroll)
// ---------------------------------------------------------------------------
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------
function RadioProductCard({
  product,
  index,
}: {
  product: RadioCategoryPageProps['products'][number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block bg-gradient-to-b from-zinc-900/80 to-zinc-950 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600/50 transition-all duration-500 h-full"
      >
        {/* Image */}
        <div className="relative aspect-square bg-black/60 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <Image
            src={getImageUrl(product.image)}
            alt={product.titleEn || product.titleFa}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-500 z-20" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {product.brand && (
            <div className="flex items-center gap-2">
              {product.brand.logo && (
                <div className="relative w-10 h-5">
                  <Image
                    src={product.brand.logo}
                    alt={product.brand.name}
                    fill
                    className="object-contain object-left brightness-0 invert opacity-60"
                    unoptimized
                  />
                </div>
              )}
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                {product.brand.name}
              </span>
            </div>
          )}

          {product.category && (
            <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-red-600/15 text-red-400 rounded">
              {product.category.nameFa}
            </span>
          )}

          <h3 className="text-white font-semibold text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
            {product.titleEn || product.titleFa}
          </h3>

          {product.shortDesc && (
            <p className="text-zinc-500 text-sm line-clamp-2">{product.shortDesc}</p>
          )}

          <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-medium pt-1">
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

// ===========================================================================
// Main Component
// ===========================================================================
export default function RadioCategoryPage({
  products,
  totalProducts,
}: RadioCategoryPageProps) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 sm:pt-36">
      {/* ================================================================= */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Radio wave animation */}
        <RadioWaveAnimation />

        <div className="relative container mx-auto px-4 py-20 sm:py-28">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-zinc-500 mb-10"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-red-500 transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-red-500">Radio Communication</span>
          </motion.nav>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-400 text-sm mb-6"
            >
              <Radio className="w-4 h-4" />
              TETRA, DMR & P25 Solutions
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Mission-Critical{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                Radio Communication
              </span>{' '}
              Systems
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl"
            >
              Melisa delivers robust and reliable digital radio communication systems
              for mission-critical operations. As an authorized Motorola Solutions
              partner, we offer complete TETRA, DMR, and P25 radio networks for
              defense, public safety, oil &amp; gas, and transportation.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <div className="px-5 py-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
                <span className="text-red-500 font-bold text-2xl">{totalProducts}</span>
                <span className="text-zinc-500 text-sm block">Products</span>
              </div>
              <div className="px-5 py-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
                <span className="text-red-500 font-bold text-2xl">200+</span>
                <span className="text-zinc-500 text-sm block">Networks Deployed</span>
              </div>
              <div className="px-5 py-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
                <span className="text-red-500 font-bold text-2xl">24/7</span>
                <span className="text-zinc-500 text-sm block">NOC Monitoring</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* KEY FEATURES                                                       */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Key Features &amp; Technologies
            </h2>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
              Industry-leading radio communication technologies engineered for
              reliability, security, and interoperability in the most demanding
              environments.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEY_FEATURES.map((feature, i) => {
              const Icon = feature.icon
              return (
                <AnimatedSection key={feature.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6, borderColor: 'rgba(220,38,38,0.4)' }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full p-6 rounded-xl bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-800 group"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-red-600/10 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
                      <Icon className="w-6 h-6 text-red-500" />
                    </div>

                    <p className="text-[11px] font-semibold uppercase tracking-widest text-red-500/70 mb-1">
                      {feature.subtitle}
                    </p>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TECHNOLOGY PARTNER                                                 */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 border-t border-zinc-900 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900/80 to-zinc-950 rounded-2xl border border-zinc-800 p-8 sm:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Partner logo area */}
                <div className="flex-shrink-0">
                  <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-red-600/10 to-red-600/5 border border-red-600/20 flex items-center justify-center">
                    <Radio className="w-16 h-16 text-red-500 opacity-80" />
                  </div>
                </div>

                {/* Text */}
                <div className="text-center lg:text-left">
                  <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">
                    Technology Partner
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
                    Motorola Solutions
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                    As an authorized Motorola Solutions channel partner, Melisa provides
                    the full portfolio of MOTOTRBO, TETRA, and P25 systems. Our
                    engineering team holds Motorola factory certifications and delivers
                    solutions backed by the global leader in mission-critical
                    communications.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    {['MOTOTRBO', 'TETRA', 'P25', 'CommandCentral', 'WAVE PTX'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-red-600/10 text-red-400 border border-red-600/20"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================= */}
      {/* WHY CHOOSE MELISA                                                  */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">
              Our Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Why Choose Melisa
            </h2>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
              Decades of expertise, regional presence, and unwavering commitment to
              operational excellence.
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-5">
            {WHY_CHOOSE.map((item, i) => (
              <AnimatedSection key={item.number} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-5 sm:gap-8 p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-red-600/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <span className="text-red-500 font-bold text-lg">{item.number}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* PRODUCTS GRID                                                      */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">
                  Product Range
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                  Radio Communication Products
                </h2>
                <p className="text-zinc-400 mt-2">
                  Showing {products.length} of {totalProducts} products
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to All Products
              </Link>
            </div>
          </AnimatedSection>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <RadioProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Radio className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* CTA SECTION                                                        */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 border-t border-zinc-900 overflow-hidden">
        {/* Animated background waves */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-red-600/10"
              initial={{ width: 100, height: 100, opacity: 0.3 }}
              animate={{
                width: [100, 1200],
                height: [100, 1200],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 6,
                delay: i * 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto mb-6">
                <Signal className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Connect Your Operations Today
              </h2>
              <p className="text-zinc-400 text-lg mb-8">
                Ready to deploy a reliable, secure radio communication network? Our
                team of certified engineers is standing by to design the ideal solution
                for your operational requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Get a Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white font-semibold rounded-xl border border-zinc-700 hover:border-red-600/50 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
