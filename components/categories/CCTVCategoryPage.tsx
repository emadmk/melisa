'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Camera,
  Shield,
  Eye,
  Zap,
  Radio,
  ArrowRight,
  Home,
  ChevronRight,
  Flame,
  Waves,
  Brain,
  Monitor,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CCTVCategoryPageProps {
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
  subcategoryName?: string
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

// ─── Feature Data ─────────────────────────────────────────────────────────────

const features = [
  {
    icon: Shield,
    title: 'Explosion-proof & Hazardous Area Cameras',
    description: 'ATEX/IECEx certified cameras designed for Zone 1 and Zone 2 hazardous environments in oil & gas facilities.',
    badge: 'ATEX/IECEx',
  },
  {
    icon: Flame,
    title: 'High-Temperature Resistant Cameras',
    description: 'Specially engineered camera housings capable of operating in extreme heat environments up to 350\u00B0C.',
    badge: 'Up to 350\u00B0C',
  },
  {
    icon: Waves,
    title: 'Corrosion-Proof Marine & Offshore Cameras',
    description: 'Salt-spray resistant and IP68-rated cameras built for offshore platforms, marine vessels, and coastal installations.',
    badge: 'IP68 Rated',
  },
  {
    icon: Brain,
    title: 'AI-Powered Video Analytics & Intrusion Detection',
    description: 'Intelligent video analysis with deep-learning algorithms for perimeter intrusion, object detection, and behavioral analytics.',
    badge: 'AI-Powered',
  },
  {
    icon: Eye,
    title: 'Long-Range PTZ Cameras with Thermal Imaging',
    description: 'High-performance pan-tilt-zoom cameras with integrated thermal sensors for detection ranges exceeding 10km.',
    badge: 'Thermal',
  },
  {
    icon: Monitor,
    title: 'Centralized Video Management Systems (VMS)',
    description: 'Enterprise-grade VMS platforms for centralized monitoring, recording, and intelligent event management across all sites.',
    badge: 'Enterprise VMS',
  },
]

const partners = [
  { name: 'Pelco by Motorola Solutions', slug: 'pelco' },
  { name: 'Avigilon (Motorola Solutions)', slug: 'avigilon' },
  { name: 'Axis Communications', slug: 'axis' },
]

const whyChoose = [
  'Specialized in harsh-environment camera systems',
  'Expertise in Ex-proof (ATEX Zone 1/2) installations',
  'Integration with DCS/SCADA systems',
  '24/7 remote monitoring capability',
  'Complete lifecycle support from design to maintenance',
]

// ─── Animated Section Wrapper ─────────────────────────────────────────────────

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
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scaleIn}
      custom={index}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500/30 via-transparent to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 lg:p-8 overflow-hidden transition-all duration-500 group-hover:border-emerald-500/30 group-hover:bg-zinc-900/95">
        {/* Glow background on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold tracking-wide mb-5">
          <Zap className="w-3 h-3" />
          {feature.badge}
        </div>

        {/* Icon */}
        <div className="relative w-14 h-14 mb-5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 rounded-xl" />
          <div className="relative w-full h-full flex items-center justify-center">
            <Icon className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-white font-bold text-lg mb-3 group-hover:text-emerald-50 transition-colors leading-tight">
          {feature.title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Product Card (Dark Theme) ────────────────────────────────────────────────

function CCTVProductCard({
  product,
  index,
}: {
  product: CCTVCategoryPageProps['products'][0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scaleIn}
      custom={index % 8}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="relative bg-gradient-to-b from-zinc-900/90 to-slate-950/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.15)]">
          {/* Image Area */}
          <div className="relative aspect-square bg-gradient-to-br from-zinc-900 to-slate-950 p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />
            <Image
              src={getImageUrl(product.image)}
              alt={product.titleEn || product.titleFa}
              fill
              className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
              unoptimized
            />
            {/* Emerald overlay on hover */}
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-all duration-500 z-20" />

            {/* Brand badge */}
            {product.brand && (
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 bg-zinc-900/80 backdrop-blur-sm rounded-md border border-zinc-700/50">
                {product.brand.logo ? (
                  <div className="relative w-14 h-5">
                    <Image
                      src={product.brand.logo}
                      alt={product.brand.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="text-zinc-400 text-xs font-medium">{product.brand.name}</span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            {product.category && (
              <span className="inline-block px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/10">
                {product.category.nameFa}
              </span>
            )}

            <h3 className="text-white font-semibold text-base leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
              {product.titleEn || product.titleFa}
            </h3>

            {product.shortDesc && (
              <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium pt-1">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CCTVCategoryPage({ products, totalProducts, subcategoryName }: CCTVCategoryPageProps) {
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950" />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Emerald glow orbs */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-cyan-500/5 rounded-full blur-[80px]" />

        {/* Scanning line animation */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
          animate={{ y: [0, 600, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Content */}
        <div className="relative container mx-auto px-4 pt-32 sm:pt-36 pb-20 lg:pb-28">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-zinc-500 mb-10"
          >
            <Link href="/" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <Link href="/products" className="hover:text-emerald-400 transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-emerald-400 font-medium">CCTV & Surveillance</span>
            {subcategoryName && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-emerald-300">{subcategoryName}</span>
              </>
            )}
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* Top badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold tracking-wide">Industrial Grade Surveillance</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
                  Industrial CCTV &{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                      Video Surveillance
                    </span>
                    <motion.span
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                    />
                  </span>{' '}
                  <span className="text-zinc-300">Systems</span>
                </h1>

                <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl">
                  Protecting Critical Infrastructure with Intelligent Surveillance
                </p>

                <p className="text-base text-zinc-500 leading-relaxed mb-10 max-w-xl">
                  Melisa is a trusted provider of advanced CCTV and video surveillance systems designed specifically for industrial environments including oil &amp; gas refineries, power plants, petrochemical complexes, and critical national infrastructure across the UAE and GCC.
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="px-5 py-4 bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800/60">
                    <span className="text-emerald-400 font-bold text-3xl block">{totalProducts}</span>
                    <span className="text-zinc-500 text-sm mt-0.5 block">Products</span>
                  </div>
                  <div className="px-5 py-4 bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800/60">
                    <span className="text-emerald-400 font-bold text-3xl block">6</span>
                    <span className="text-zinc-500 text-sm mt-0.5 block">Solution Areas</span>
                  </div>
                  <div className="px-5 py-4 bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800/60">
                    <span className="text-emerald-400 font-bold text-3xl block">24/7</span>
                    <span className="text-zinc-500 text-sm mt-0.5 block">Monitoring</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                  >
                    Browse Products
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-zinc-800/60 backdrop-blur-sm text-white font-semibold rounded-xl border border-zinc-700/50 hover:border-emerald-500/30 hover:bg-zinc-800 transition-all duration-300"
                  >
                    Request Quote
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right: Visual element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-emerald-500/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                />

                {/* Middle ring */}
                <motion.div
                  className="absolute inset-8 rounded-full border border-emerald-500/15"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Dots on ring */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500/50 rounded-full" />
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-emerald-500/30 rounded-full" />
                </motion.div>

                {/* Inner glow */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 backdrop-blur-sm" />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-8 bg-emerald-500/10 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 backdrop-blur-xl">
                      <Camera className="w-14 h-14 text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Floating feature badges */}
                <motion.div
                  className="absolute top-4 right-8 px-3 py-2 bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-zinc-800/60 shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-xs font-medium">ATEX Certified</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-12 left-4 px-3 py-2 bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-zinc-800/60 shadow-xl"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-xs font-medium">Thermal Imaging</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -left-2 px-3 py-2 bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-zinc-800/60 shadow-xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-xs font-medium">AI Analytics</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ── Features Section ────────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 bg-slate-950">
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-[150px]" />

        <div className="relative container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Camera className="w-4 h-4" />
              Key Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
              Complete Surveillance{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Solutions
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Purpose-built surveillance technologies engineered to withstand the most demanding industrial conditions while delivering uncompromising image quality and reliability.
            </p>
          </AnimatedSection>

          <motion.div
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Technology Partners Section ─────────────────────────────────────── */}
      <section className="relative py-20 lg:py-24 bg-zinc-900/50">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Radio className="w-4 h-4" />
              Technology Partners
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
              World-Leading{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Technology Partners
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              We partner with globally recognized leaders in video surveillance technology to deliver best-in-class solutions.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {partners.map((partner, index) => (
              <AnimatedSection key={partner.slug} delay={index}>
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="group relative"
                >
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/60 rounded-2xl p-8 text-center hover:border-emerald-500/30 transition-all duration-500">
                    <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 rounded-2xl flex items-center justify-center border border-emerald-500/10">
                      <Camera className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{partner.name}</h3>
                    <p className="text-zinc-500 text-sm">Official Partner</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Melisa Section ──────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />

        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <div>
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" />
                  Why Melisa
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                  Why Choose{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Melisa
                  </span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                  With decades of experience in industrial security, Melisa delivers end-to-end CCTV solutions tailored to the most challenging environments in the Middle East.
                </p>
              </AnimatedSection>

              <div className="space-y-5">
                {whyChoose.map((item, index) => (
                  <AnimatedSection key={index} delay={index + 1}>
                    <motion.div
                      whileHover={{ x: 6, transition: { duration: 0.2 } }}
                      className="flex items-start gap-4 group cursor-default"
                    >
                      {/* Number */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
                        <span className="text-emerald-400 font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      {/* Text */}
                      <div className="pt-1.5">
                        <p className="text-white font-medium text-base group-hover:text-emerald-100 transition-colors">
                          {item}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Right: Visual card */}
            <AnimatedSection delay={2}>
              <div className="relative">
                {/* Decorative background card */}
                <div className="absolute inset-0 translate-x-4 translate-y-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10" />

                <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800/60 p-8 lg:p-10 overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

                  <div className="relative space-y-8">
                    {/* Certification badges */}
                    <div>
                      <p className="text-zinc-500 text-sm font-medium tracking-wider uppercase mb-4">Certifications</p>
                      <div className="flex flex-wrap gap-3">
                        {['ATEX', 'IECEx', 'IP68', 'NEMA 4X', 'EN 50155'].map((cert) => (
                          <span key={cert} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-bold tracking-wider">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                        <span className="text-emerald-400 font-extrabold text-2xl block">350&deg;C</span>
                        <span className="text-zinc-500 text-sm">Max Temperature</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                        <span className="text-emerald-400 font-extrabold text-2xl block">10km+</span>
                        <span className="text-zinc-500 text-sm">Detection Range</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                        <span className="text-emerald-400 font-extrabold text-2xl block">4K UHD</span>
                        <span className="text-zinc-500 text-sm">Max Resolution</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                        <span className="text-emerald-400 font-extrabold text-2xl block">Zone 1</span>
                        <span className="text-zinc-500 text-sm">ATEX Rating</span>
                      </div>
                    </div>

                    {/* Support info */}
                    <div className="flex items-center gap-3 bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <p className="text-zinc-300 text-sm">
                        Complete lifecycle support &mdash; from design and engineering to installation and maintenance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Products Grid Section ──────────────────────────────────────────── */}
      <section id="products" className="relative py-20 lg:py-28 bg-slate-950">
        {/* Top divider line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Eye className="w-4 h-4" />
              Product Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
              CCTV &amp; Surveillance{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Explore our comprehensive range of industrial-grade video surveillance equipment from world-leading manufacturers.
            </p>
          </AnimatedSection>

          {/* Back to all products link */}
          <AnimatedSection className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to All Products
            </Link>
          </AnimatedSection>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <CCTVProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">No products available in this category yet.</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mt-4 transition-colors"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA Section ─────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-24 bg-zinc-900/50 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />

        <div className="relative container mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8"
              >
                <Phone className="w-4 h-4" />
                Get in Touch
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                Get a Custom{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Surveillance Solution
                </span>
              </h2>

              <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                Every industrial facility has unique security requirements. Our team of surveillance engineers will design a bespoke CCTV solution tailored to your specific environment, safety zones, and compliance needs.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 text-base"
                >
                  Contact Our Engineers
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+971527664837"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800/60 backdrop-blur-sm text-white font-semibold rounded-xl border border-zinc-700/50 hover:border-emerald-500/30 hover:bg-zinc-800 transition-all duration-300 text-base"
                >
                  <Phone className="w-5 h-5 text-emerald-400" />
                  (971) 527664837
                </a>
              </div>

              {/* Contact row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-500 text-sm">
                <a href="mailto:info@melisa.ae" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  info@melisa.ae
                </a>
                <span className="hidden sm:block text-zinc-700">|</span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dubai, United Arab Emirates
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Wave Transition to White ───────────────────────────────────────── */}
      <div className="relative bg-zinc-900/50">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L48 110C96 100 192 80 288 65C384 50 480 40 576 45C672 50 768 70 864 78C960 86 1056 82 1152 72C1248 62 1344 46 1392 38L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="rgb(249 250 251)"
          />
        </svg>
      </div>
    </div>
  )
}
