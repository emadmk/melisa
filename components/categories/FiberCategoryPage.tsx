'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Activity,
  Zap,
  Globe,
  Cpu,
  Shield,
  ArrowRight,
  Home,
  ChevronRight,
  Layers,
  Radio,
  Wrench,
  Eye,
  FileText,
  Sparkles,
  Phone,
} from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FiberCategoryPageProps {
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CYAN = '#06B6D4'

const FEATURES = [
  {
    icon: Zap,
    title: 'OTN/DWDM Systems',
    subtitle: 'up to 400Gbps per wavelength',
    description:
      'Ultra-high-capacity Dense Wavelength Division Multiplexing systems engineered for national backbone networks and carrier-grade optical transport.',
  },
  {
    icon: Radio,
    title: 'ROADM & OXC',
    subtitle: 'Dynamic Wavelength Routing',
    description:
      'Reconfigurable Optical Add-Drop Multiplexers and Optical Cross-Connects enabling flexible, software-defined wavelength management.',
  },
  {
    icon: Home,
    title: 'GPON / XGS-PON',
    subtitle: 'Fiber-to-the-Home (FTTH)',
    description:
      'End-to-end passive optical network solutions for residential, commercial, and MDU deployments with symmetrical multi-gigabit speeds.',
  },
  {
    icon: Globe,
    title: 'Submarine & Terrestrial Cable',
    subtitle: 'Fiber Optic Installation',
    description:
      'Complete design, route survey, installation, and commissioning of submarine and overland fiber optic cable systems across the GCC.',
  },
  {
    icon: Eye,
    title: 'OTDR Testing',
    subtitle: 'Fiber Characterization Services',
    description:
      'Advanced Optical Time-Domain Reflectometer testing, end-to-end loss measurement, and comprehensive fiber characterization reports.',
  },
  {
    icon: FileText,
    title: 'Network Design & Splicing',
    subtitle: 'Full Documentation',
    description:
      'From HLD/LLD through to fusion splicing, patching, labeling, and as-built documentation — turnkey fiber deployment services.',
  },
]

const WHY_CHOOSE = [
  {
    icon: Wrench,
    text: 'Experienced fiber optic design & deployment teams',
  },
  {
    icon: Layers,
    text: 'Complete turnkey OTN/DWDM project delivery',
  },
  {
    icon: Sparkles,
    text: 'Certified fiber splicing technicians',
  },
  {
    icon: Eye,
    text: 'Advanced OTDR testing & documentation',
  },
  {
    icon: Shield,
    text: 'Long-term O&M and SLA-based support contracts',
  },
]

const PARTNERS = [
  'Huawei',
  'ZTE',
  'Nokia',
  'Ciena',
  'Infinera',
  'Corning',
  'Fujikura',
  'EXFO',
]

// ---------------------------------------------------------------------------
// Animated Fiber Lines (Hero Background)
// ---------------------------------------------------------------------------

function FiberLinesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = 0
    let height = 0

    interface FiberStrand {
      points: { x: number; y: number }[]
      pulsePosition: number
      speed: number
      opacity: number
      width: number
    }

    const strands: FiberStrand[] = []

    function resize() {
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    function createStrands() {
      strands.length = 0
      const count = Math.max(6, Math.floor(width / 160))
      for (let i = 0; i < count; i++) {
        const pts: { x: number; y: number }[] = []
        const segments = 6 + Math.floor(Math.random() * 4)
        const startY = Math.random() * height
        const startX = -20
        for (let s = 0; s <= segments; s++) {
          pts.push({
            x: startX + (s / segments) * (width + 40),
            y: startY + (Math.random() - 0.5) * 180,
          })
        }
        strands.push({
          points: pts,
          pulsePosition: Math.random(),
          speed: 0.001 + Math.random() * 0.003,
          opacity: 0.12 + Math.random() * 0.18,
          width: 1 + Math.random() * 1.5,
        })
      }
    }

    function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
      const t2 = t * t
      const t3 = t2 * t
      return (
        0.5 *
        (2 * p1 +
          (-p0 + p2) * t +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
          (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      )
    }

    function drawStrand(strand: FiberStrand) {
      if (!ctx) return
      const { points, pulsePosition, opacity, width: sw } = strand

      // Draw the fiber strand path
      ctx.beginPath()
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)]
        const p1 = points[i]
        const p2 = points[Math.min(points.length - 1, i + 1)]
        const p3 = points[Math.min(points.length - 1, i + 2)]
        const steps = 20
        for (let s = 0; s <= steps; s++) {
          const t = s / steps
          const x = catmull(p0.x, p1.x, p2.x, p3.x, t)
          const y = catmull(p0.y, p1.y, p2.y, p3.y, t)
          if (i === 0 && s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.5})`
      ctx.lineWidth = sw
      ctx.stroke()

      // Draw the travelling light pulse
      const totalSegments = points.length - 1
      const floatIdx = pulsePosition * totalSegments
      const segIdx = Math.floor(floatIdx)
      const segT = floatIdx - segIdx

      const i = Math.min(segIdx, points.length - 2)
      const p0 = points[Math.max(0, i - 1)]
      const p1 = points[i]
      const p2 = points[Math.min(points.length - 1, i + 1)]
      const p3 = points[Math.min(points.length - 1, i + 2)]

      const px = catmull(p0.x, p1.x, p2.x, p3.x, segT)
      const py = catmull(p0.y, p1.y, p2.y, p3.y, segT)

      const gradient = ctx.createRadialGradient(px, py, 0, px, py, 60)
      gradient.addColorStop(0, `rgba(6, 182, 212, 0.9)`)
      gradient.addColorStop(0.3, `rgba(6, 182, 212, 0.3)`)
      gradient.addColorStop(1, `rgba(6, 182, 212, 0)`)
      ctx.beginPath()
      ctx.arc(px, py, 60, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Bright core
      const coreGrad = ctx.createRadialGradient(px, py, 0, px, py, 6)
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
      coreGrad.addColorStop(0.5, `rgba(6, 182, 212, 0.7)`)
      coreGrad.addColorStop(1, `rgba(6, 182, 212, 0)`)
      ctx.beginPath()
      ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = coreGrad
      ctx.fill()
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (const strand of strands) {
        strand.pulsePosition += strand.speed
        if (strand.pulsePosition > 1.05) strand.pulsePosition = -0.05
        drawStrand(strand)
      }
      animationId = requestAnimationFrame(animate)
    }

    resize()
    createStrands()
    animate()

    const handleResize = () => {
      resize()
      createStrands()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}

// ---------------------------------------------------------------------------
// Section wrapper with viewport animation
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
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Product Card (Fiber Theme)
// ---------------------------------------------------------------------------

function FiberProductCard({
  product,
}: {
  product: FiberCategoryPageProps['products'][number]
}) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-500 h-full flex flex-col"
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-cyan-500/20 via-transparent to-cyan-500/5" />
        </div>

        {/* Image */}
        <div className="relative aspect-square bg-black/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent z-10" />
          <Image
            src={getImageUrl(product.image)}
            alt={product.titleEn || product.titleFa}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-all duration-500 z-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 flex flex-col flex-1">
          {/* Category / Brand badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.category && (
              <span className="inline-block px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                {product.category.nameFa}
              </span>
            )}
            {product.brand && (
              <span className="inline-block px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-white/5 text-gray-400 rounded-full border border-white/10">
                {product.brand.name}
              </span>
            )}
          </div>

          <h3 className="text-white font-semibold text-base leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
            {product.titleEn || product.titleFa}
          </h3>

          {product.shortDesc && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
              {product.shortDesc}
            </p>
          )}

          <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-medium mt-auto">
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function FiberCategoryPage({
  products,
  totalProducts,
}: FiberCategoryPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])

  // Animation variants
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-32 sm:pt-36">
      {/* ----------------------------------------------------------------- */}
      {/* HERO SECTION                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Fiber optic light animation canvas */}
        <FiberLinesCanvas />

        {/* Radial gradient overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cyan-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-24"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-10"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/products"
              className="hover:text-cyan-400 transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-cyan-400">OTN & Fiber Optic</span>
          </motion.nav>

          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6"
            >
              <Activity className="w-4 h-4" />
              <span>Optical Transport Solutions</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              <span className="text-white">OTN & Fiber Optic</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${CYAN}, #14B8A6, #22D3EE)`,
                }}
              >
                Communication Networks
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-lg sm:text-xl text-cyan-300/70 font-medium mb-4"
            >
              High-Speed Optical Transport Solutions
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl mb-10"
            >
              Melisa provides cutting-edge Optical Transport Network (OTN) and
              fiber optic communication solutions for telecom operators, ISPs,
              and large-scale enterprise networks in the UAE and GCC. We deliver
              ultra-high-capacity optical infrastructure for national backbone,
              metro, and access networks.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="flex flex-wrap gap-4 sm:gap-6"
            >
              {[
                { value: `${totalProducts}+`, label: 'Products' },
                { value: '400G', label: 'Per Wavelength' },
                { value: '99.999%', label: 'Uptime SLA' },
                { value: 'GCC', label: 'Coverage' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                >
                  <div className="text-cyan-400 font-bold text-xl sm:text-2xl">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FEATURES SECTION                                                  */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest font-semibold mb-4">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              End-to-End Fiber Optic Solutions
            </h2>
            <p className="text-gray-400 text-lg">
              From high-capacity OTN backbone to last-mile FTTH, we cover every
              layer of optical network infrastructure.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group relative rounded-2xl bg-gradient-to-b from-gray-900/80 to-gray-950 border border-gray-800/60 hover:border-cyan-500/40 p-7 transition-colors duration-500 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-cyan-400/70 text-sm font-medium mb-3">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* TECHNOLOGY PARTNERS                                               */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative py-16 sm:py-20 border-t border-gray-800/50">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest font-semibold mb-4">
              Technology Partners
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Multiple Leading Global Vendors
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              We partner with world-class equipment manufacturers to deliver
              best-in-class optical solutions.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {PARTNERS.map((partner) => (
                <motion.div
                  key={partner}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(6,182,212,0.5)' }}
                  className="px-8 py-5 rounded-xl bg-gray-900/60 border border-gray-800/60 flex items-center justify-center min-w-[140px]"
                >
                  <span className="text-gray-300 font-semibold text-base tracking-wide">
                    {partner}
                  </span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* WHY CHOOSE MELISA                                                 */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative py-20 sm:py-28 border-t border-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - content */}
            <AnimatedSection>
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest font-semibold mb-4">
                Why Melisa
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Choose Melisa for Fiber Optic Projects?
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                With deep expertise in optical transport technologies and a
                proven track record across the GCC region, Melisa is your
                trusted partner for mission-critical fiber infrastructure.
              </p>

              <div className="space-y-5">
                {WHY_CHOOSE.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <p className="text-gray-300 text-base pt-2">
                        {item.text}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatedSection>

            {/* Right - decorative visual */}
            <AnimatedSection delay={0.3}>
              <div className="relative aspect-square max-w-md mx-auto lg:ml-auto">
                {/* Concentric rings */}
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                    transition={{
                      duration: 30 + ring * 10,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute rounded-full border"
                    style={{
                      inset: `${ring * 14}%`,
                      borderColor: `rgba(6, 182, 212, ${0.15 - ring * 0.03})`,
                    }}
                  />
                ))}

                {/* Center glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/10 blur-xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-400/20 border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbiting nodes */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 40,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.5,
                    }}
                    className="absolute inset-[5%]"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div
                      className="absolute w-3 h-3 rounded-full bg-cyan-400/60 shadow-lg shadow-cyan-500/30"
                      style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* PRODUCTS GRID                                                     */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative py-20 sm:py-28 border-t border-gray-800/50">
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest font-semibold mb-4">
                Product Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                OTN & Fiber Optic Products
              </h2>
              <p className="text-gray-500 mt-2">
                {totalProducts} products available
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-sm shrink-0"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          {products.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <FiberProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24 rounded-2xl border border-gray-800/40 bg-gray-900/30">
              <Cpu className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No products available at this time.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* CTA SECTION                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/[0.06] rounded-full blur-[120px]" />
          {/* Animated horizontal lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full"
              style={{
                top: `${20 + i * 15}%`,
                background: `linear-gradient(90deg, transparent, rgba(6,182,212,${0.06 + i * 0.02}), transparent)`,
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 1.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <motion.div
              whileInView={{ scale: [0.95, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Get Started Today</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                <span className="text-white">Light Up Your</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${CYAN}, #14B8A6, #22D3EE)`,
                  }}
                >
                  Network Infrastructure
                </span>
              </h2>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Partner with Melisa to design, deploy, and maintain
                next-generation optical networks. Let our team of certified
                engineers transform your connectivity.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                  style={{
                    background: `linear-gradient(135deg, ${CYAN}, #0891B2)`,
                  }}
                >
                  <Phone className="w-5 h-5" />
                  Contact Our Engineers
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:text-white transition-all duration-300"
                >
                  Browse All Products
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* BACK LINK                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="border-t border-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to All Products
          </Link>
        </div>
      </div>
    </div>
  )
}
