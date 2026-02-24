'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wifi,
  Signal,
  Zap,
  Shield,
  Radio,
  ArrowRight,
  Home,
  ChevronRight,
  Layers,
  Monitor,
  CheckCircle2,
  Sparkles,
  Globe,
  Headphones,
} from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

interface MicrowaveCategoryPageProps {
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

/* ------------------------------------------------------------------ */
/*  Animated microwave beam visualization                              */
/* ------------------------------------------------------------------ */
function MicrowaveBeamHero() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Large purple glow top-right */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      {/* Smaller glow bottom-left */}
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />

      {/* Tower left */}
      <svg
        className="absolute left-[8%] bottom-[18%] w-12 h-32 sm:w-16 sm:h-40 text-purple-500/30"
        viewBox="0 0 64 160"
        fill="none"
      >
        <path d="M32 0 L32 120" stroke="currentColor" strokeWidth="3" />
        <path d="M20 120 L32 80 L44 120" stroke="currentColor" strokeWidth="2" />
        <path d="M12 160 L20 120 L44 120 L52 160" stroke="currentColor" strokeWidth="2" />
        {/* Antenna dish */}
        <circle cx="32" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
        <motion.circle
          cx="32"
          cy="8"
          r="7"
          stroke="rgba(139,92,246,0.6)"
          strokeWidth="2"
          fill="none"
          animate={{ r: [7, 12, 7], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Tower right */}
      <svg
        className="absolute right-[8%] bottom-[18%] w-12 h-32 sm:w-16 sm:h-40 text-purple-500/30"
        viewBox="0 0 64 160"
        fill="none"
      >
        <path d="M32 0 L32 120" stroke="currentColor" strokeWidth="3" />
        <path d="M20 120 L32 80 L44 120" stroke="currentColor" strokeWidth="2" />
        <path d="M12 160 L20 120 L44 120 L52 160" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
        <motion.circle
          cx="32"
          cy="8"
          r="7"
          stroke="rgba(139,92,246,0.6)"
          strokeWidth="2"
          fill="none"
          animate={{ r: [7, 12, 7], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>

      {/* Animated dashed beam line between towers */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.line
          x1="14%"
          y1="56%"
          x2="86%"
          y2="56%"
          stroke="url(#beam-gradient)"
          strokeWidth="2"
          strokeDasharray="8 6"
          animate={{ strokeDashoffset: [0, -28] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Second beam line offset */}
        <motion.line
          x1="14%"
          y1="58%"
          x2="86%"
          y2="58%"
          stroke="url(#beam-gradient)"
          strokeWidth="1"
          strokeDasharray="4 10"
          animate={{ strokeDashoffset: [0, 28] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139,92,246,0)" />
            <stop offset="20%" stopColor="rgba(139,92,246,0.5)" />
            <stop offset="50%" stopColor="rgba(139,92,246,0.8)" />
            <stop offset="80%" stopColor="rgba(139,92,246,0.5)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Pulsing center signal burst */}
      <motion.div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-500/60"
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-400/40"
        animate={{
          scale: [1, 4, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature card component                                             */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Signal,
    title: 'High-Capacity Licensed Microwave Links',
    desc: 'Up to 10 Gbps throughput for demanding backbone and backhaul requirements.',
  },
  {
    icon: Layers,
    title: 'Split-Mount & Full-Outdoor Configurations',
    desc: 'Flexible deployment options to match any site topology and space constraint.',
  },
  {
    icon: Radio,
    title: 'Adaptive Modulation (QPSK to 4096QAM)',
    desc: 'Dynamic modulation ensures maximum throughput under varying atmospheric conditions.',
  },
  {
    icon: Wifi,
    title: 'XPIC & Multi-Band Support',
    desc: 'Cross-polarisation interference cancellation doubles capacity on a single frequency.',
  },
  {
    icon: Shield,
    title: 'Built-in AES-256 Encryption & Header Compression',
    desc: 'Military-grade security with optimised bandwidth utilisation across the link.',
  },
  {
    icon: Monitor,
    title: 'Network Management System (NMS)',
    desc: 'Centralised monitoring, configuration, and fault management for the entire network.',
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  const Icon = feature.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/80 hover:border-purple-500/40 transition-all duration-500 overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-transparent transition-all duration-500 rounded-2xl" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all duration-500">
          <Icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-100 transition-colors">
          {feature.title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Product card (dark, purple accent)                                 */
/* ------------------------------------------------------------------ */
function MicrowaveProductCard({
  product,
}: {
  product: MicrowaveCategoryPageProps['products'][number]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      className="group relative bg-gradient-to-b from-zinc-900 to-slate-950 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-500"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-black/40 p-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent z-10" />
          <Image
            src={getImageUrl(product.image)}
            alt={product.titleEn || product.titleFa}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-500 z-20" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-3">
        {product.brand && (
          <div className="flex items-center gap-2">
            {product.brand.logo && (
              <div className="relative w-8 h-4">
                <Image
                  src={product.brand.logo}
                  alt={product.brand.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <span className="text-xs text-zinc-500">{product.brand.name}</span>
          </div>
        )}
        {product.category && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-500/15 text-purple-400 rounded">
            {product.category.nameFa}
          </span>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-white font-semibold text-base leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
            {product.titleEn || product.titleFa}
          </h3>
        </Link>

        {product.shortDesc && (
          <p className="text-zinc-500 text-sm line-clamp-2">{product.shortDesc}</p>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors mt-1"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Why Choose Melisa items                                            */
/* ------------------------------------------------------------------ */
const whyChooseItems = [
  { icon: CheckCircle2, text: 'Authorized SIAE Microelettronica partner in UAE' },
  { icon: Globe, text: 'Full link budget planning & frequency coordination' },
  { icon: Zap, text: 'Professional tower & antenna installation teams' },
  { icon: Sparkles, text: 'Complete commissioning & acceptance testing' },
  { icon: Headphones, text: 'Extended warranty and 24/7 NOC support' },
]

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */
export default function MicrowaveCategoryPage({
  products,
  totalProducts,
}: MicrowaveCategoryPageProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleProducts = showAll ? products : products.slice(0, 8)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative pt-32 sm:pt-36 pb-24 lg:pb-32 overflow-hidden">
        <MicrowaveBeamHero />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-zinc-500 mb-10"
          >
            <Link
              href="/"
              className="hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-purple-400 transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-400">Microwave Communication</span>
          </motion.nav>

          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
            >
              <Radio className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Licensed &amp; Unlicensed Microwave Links
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Microwave Communication{' '}
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                Systems
              </span>{' '}
              for Long-Distance Connectivity
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg text-zinc-400 leading-relaxed max-w-2xl mb-10"
            >
              Melisa provides high-capacity microwave communication systems for telecom
              operators, enterprises, and government networks. Our solutions offer
              carrier-grade reliability for backbone, backhaul, and enterprise connectivity
              across the UAE and Middle East.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <div className="px-5 py-3 bg-zinc-900/70 rounded-xl border border-zinc-800 backdrop-blur-sm">
                <span className="text-purple-400 font-bold text-2xl">{totalProducts}</span>
                <span className="text-zinc-500 text-sm block">Products</span>
              </div>
              <div className="px-5 py-3 bg-zinc-900/70 rounded-xl border border-zinc-800 backdrop-blur-sm">
                <span className="text-purple-400 font-bold text-2xl">10 Gbps</span>
                <span className="text-zinc-500 text-sm block">Max Capacity</span>
              </div>
              <div className="px-5 py-3 bg-zinc-900/70 rounded-xl border border-zinc-800 backdrop-blur-sm">
                <span className="text-purple-400 font-bold text-2xl">4096QAM</span>
                <span className="text-zinc-500 text-sm block">Adaptive Mod</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  KEY FEATURES                                                 */}
      {/* ============================================================ */}
      <section className="relative py-20 lg:py-28 bg-zinc-900/30">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Key Features &amp; Technology
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Enterprise-proven microwave technology engineered for extreme
              reliability and maximum throughput.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TECHNOLOGY PARTNER -- SIAE Microelettronica                  */}
      {/* ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Accent glow */}
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12"
          >
            {/* Left -- partner logo / highlight */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
                <Globe className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                Technology Partner
              </h3>
              <p className="mt-2 text-purple-400 font-semibold text-lg">
                SIAE Microelettronica
              </p>
              <p className="text-zinc-500 text-sm mt-1">Milan, Italy</p>
            </div>

            {/* Right -- description */}
            <div className="flex-1">
              <p className="text-zinc-300 leading-relaxed text-lg mb-6">
                SIAE Microelettronica is a world-leading manufacturer of microwave
                radio and wireless transport solutions. With over 70 years of heritage
                in telecommunications, SIAE equips telecom operators and enterprises in
                more than 100 countries.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Melisa is proud to be the authorized partner for SIAE products in the
                UAE, providing local support, installation, and after-sales services
                backed by world-class Italian engineering.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Point-to-Point', 'Packet Radio', 'Long-Haul', 'E-Band', 'Multi-Band'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY CHOOSE MELISA                                           */}
      {/* ============================================================ */}
      <section className="relative py-20 lg:py-28 bg-zinc-900/30">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
                Why Melisa
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-6">
                Your Trusted Microwave Partner in the Middle East
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                From initial link design to ongoing network operations, Melisa delivers
                turnkey microwave solutions tailored to the region&apos;s demanding
                environments. Our engineers ensure every link performs at its theoretical
                maximum.
              </p>
            </motion.div>

            {/* Right column -- checklist */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-5"
            >
              {whyChooseItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/30 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-zinc-300 font-medium leading-snug pt-1.5">
                      {item.text}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRODUCTS GRID                                                */}
      {/* ============================================================ */}
      <section className="relative py-20 lg:py-28">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
                Catalogue
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                Microwave Products
              </h2>
              <p className="text-zinc-400 mt-2">
                {totalProducts} product{totalProducts !== 1 ? 's' : ''} available
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium text-sm"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleProducts.map((product) => (
                  <MicrowaveProductCard key={product.id} product={product} />
                ))}
              </div>

              {!showAll && products.length > 8 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAll(true)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 border border-zinc-700 hover:border-purple-500/40 transition-all duration-300"
                  >
                    Show All {totalProducts} Products
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Radio className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                          */}
      {/* ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-8">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Bridge the Distance{' '}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
              Whether you need a single point-to-point link or a nationwide backbone,
              our engineering team is ready to design, deploy, and support your microwave
              network end-to-end.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg shadow-purple-600/20"
              >
                Request a Link Budget Study
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl border border-zinc-700 hover:border-purple-500/40 transition-all duration-300"
              >
                Browse All Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BACK TO PRODUCTS LINK                                       */}
      {/* ============================================================ */}
      <div className="border-t border-zinc-800/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to All Products
          </Link>
        </div>
      </div>
    </div>
  )
}
