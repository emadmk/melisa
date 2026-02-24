'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Shield,
  Radar,
  Eye,
  Zap,
  Target,
  ArrowRight,
  Home,
  ChevronRight,
  Radio,
  Cpu,
  CloudRain,
  Camera,
  Settings,
  CheckCircle2,
  Phone,
  Award,
  Clock,
  GraduationCap,
  Wrench,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RadarCategoryPageProps {
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
// Data
// ---------------------------------------------------------------------------

const keyFeatures = [
  {
    icon: Radio,
    title: '360\u00B0 Continuous Surveillance Radar',
    description: 'Up to 5km range with full perimeter coverage, providing uninterrupted situational awareness around the clock.',
  },
  {
    icon: CloudRain,
    title: 'All-Weather Detection',
    description: 'Reliable performance in rain, fog, dust, and sandstorms \u2014 engineered for the harshest GCC environments.',
  },
  {
    icon: Cpu,
    title: 'AI-Based Target Classification',
    description: 'Intelligent algorithms distinguish between humans, vehicles, and drones, reducing operator workload.',
  },
  {
    icon: Camera,
    title: 'Automatic PTZ Camera Slew-to-Cue',
    description: 'Radar detections instantly direct PTZ cameras to the target for immediate visual verification.',
  },
  {
    icon: Settings,
    title: 'Integration with Existing CCTV & Access Control',
    description: 'Seamlessly connects with your current security ecosystem for a unified command picture.',
  },
  {
    icon: Shield,
    title: 'Ultra-Low False Alarm Rate',
    description: 'Less than 1 false alarm per day, ensuring your security team stays focused on real threats.',
  },
]

const whyChooseMelisa = [
  {
    icon: Award,
    text: 'Only authorized Navtech Radar integrator in UAE',
  },
  {
    icon: Target,
    text: 'Proven installations in oil & gas, airports, and military',
  },
  {
    icon: Wrench,
    text: 'End-to-end project delivery (design, install, commission)',
  },
  {
    icon: Clock,
    text: 'Real-time 24/7 monitoring center support',
  },
  {
    icon: GraduationCap,
    text: 'Full training and lifecycle maintenance programs',
  },
]

// ---------------------------------------------------------------------------
// Animated section wrapper
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
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Radar scan animated element (SVG)
// ---------------------------------------------------------------------------

function RadarScanAnimation() {
  return (
    <div className="relative w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] mx-auto select-none pointer-events-none">
      {/* Concentric rings */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-500/20"
          style={{
            width: `${i * 25}%`,
            height: `${i * 25}%`,
            top: `${50 - (i * 25) / 2}%`,
            left: `${50 - (i * 25) / 2}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
        />
      ))}

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_20px_4px_rgba(59,130,246,0.6)]" />

      {/* Rotating sweep */}
      <motion.div
        className="absolute top-1/2 left-1/2 origin-bottom-left"
        style={{ width: '50%', height: '2px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-500/80 to-transparent rounded-full" />
      </motion.div>

      {/* Conic sweep trail (using pseudo-gradient background) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.12) 0deg, transparent 60deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-blue-500/30"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blip targets */}
      {[
        { top: '28%', left: '62%', delay: 1 },
        { top: '55%', left: '30%', delay: 2.5 },
        { top: '38%', left: '74%', delay: 0.5 },
        { top: '68%', left: '58%', delay: 3.2 },
      ].map((blip, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]"
          style={{ top: blip.top, left: blip.left }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: blip.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Cross-hair lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-blue-500/10" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-blue-500/10" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------

function RadarProductCard({
  product,
}: {
  product: RadarCategoryPageProps['products'][number]
}) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors duration-500"
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-blue-500/5 to-transparent" />

        {/* Image */}
        <div className="relative aspect-square bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent z-10" />
          {product.image ? (
            <Image
              src={product.image}
              alt={product.titleEn || product.titleFa}
              fill
              className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Radar className="w-16 h-16 text-slate-700" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          {product.category && (
            <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-500/15 text-blue-400 rounded-full">
              {product.category.nameFa}
            </span>
          )}

          <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
            {product.titleEn || product.titleFa}
          </h3>

          {product.shortDesc && (
            <p className="text-slate-400 text-sm line-clamp-2">{product.shortDesc}</p>
          )}

          <span className="inline-flex items-center gap-1.5 text-blue-500 text-sm font-medium pt-1">
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RadarCategoryPage({
  products,
  totalProducts,
}: RadarCategoryPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden pt-32 sm:pt-36 pb-24 lg:pb-32">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.8) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Blue radial glow */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: content */}
            <div>
              {/* Breadcrumb */}
              <motion.nav
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-sm text-slate-400 mb-8"
              >
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <Link
                  href="/products"
                  className="hover:text-blue-400 transition-colors"
                >
                  Products
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-blue-400">Navtech Radar</span>
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                  <Radar className="w-4 h-4" />
                  Technology Partner: Navtech Radar (UK)
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-tight mb-6">
                  Perimeter Radar{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                    Security Systems
                  </span>{' '}
                  for Critical Infrastructure
                </h1>

                <p className="text-lg sm:text-xl text-blue-200/60 mb-4 max-w-xl">
                  Next-Generation Radar-Based Intrusion Detection
                </p>

                <p className="text-slate-400 leading-relaxed max-w-xl mb-8">
                  Melisa is the authorized partner and system integrator for
                  Navtech Radar in the UAE and GCC region. We deliver
                  state-of-the-art radar-based perimeter security systems for
                  high-value assets and critical infrastructure.
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4">
                  <div className="px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                    <span className="text-blue-400 font-bold text-2xl block">
                      {totalProducts}
                    </span>
                    <span className="text-slate-500 text-xs uppercase tracking-wider">
                      Products
                    </span>
                  </div>
                  <div className="px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                    <span className="text-blue-400 font-bold text-2xl block">5km</span>
                    <span className="text-slate-500 text-xs uppercase tracking-wider">
                      Max Range
                    </span>
                  </div>
                  <div className="px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                    <span className="text-blue-400 font-bold text-2xl block">360&deg;</span>
                    <span className="text-slate-500 text-xs uppercase tracking-wider">
                      Coverage
                    </span>
                  </div>
                  <div className="px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                    <span className="text-blue-400 font-bold text-2xl block">&lt;1/day</span>
                    <span className="text-slate-500 text-xs uppercase tracking-wider">
                      False Alarms
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: animated radar graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="hidden lg:flex items-center justify-center"
            >
              <RadarScanAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== KEY FEATURES ====== */}
      <section className="relative py-24 bg-zinc-900/50">
        {/* Subtle divider glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Key{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Features
              </span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              Navtech Radar systems deliver unmatched perimeter protection
              through cutting-edge radar technology purpose-built for the
              toughest environments.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, i) => {
              const Icon = feature.icon
              return (
                <AnimatedSection key={feature.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4, borderColor: 'rgba(59,130,246,0.4)' }}
                    className="relative p-6 rounded-2xl bg-slate-950/80 border border-slate-800 h-full transition-colors duration-300 group"
                  >
                    {/* Icon container */}
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Corner glow on hover */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-bl-full transition-colors duration-500 pointer-events-none" />
                  </motion.div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== TECHNOLOGY PARTNER ====== */}
      <section className="relative py-24 overflow-hidden">
        {/* Background accent */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: radar visual */}
            <AnimatedSection>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 p-8 sm:p-12 flex items-center justify-center">
                <div className="lg:hidden">
                  <RadarScanAnimation />
                </div>
                <div className="hidden lg:block">
                  {/* Stylised radar screen */}
                  <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                    {/* Grid overlay */}
                    <div
                      className="absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                      }}
                    />
                    {/* Concentric arcs */}
                    {[1, 2, 3].map((r) => (
                      <div
                        key={r}
                        className="absolute rounded-full border border-blue-500/15"
                        style={{
                          width: `${r * 30}%`,
                          height: `${r * 60}%`,
                          bottom: '0',
                          left: `${50 - (r * 30) / 2}%`,
                        }}
                      />
                    ))}
                    {/* Sweep */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 origin-bottom"
                      style={{ width: '2px', height: '90%' }}
                      animate={{ rotate: [-45, 45] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-t from-blue-500/80 to-transparent rounded-full" />
                    </motion.div>
                    {/* Label */}
                    <span className="absolute bottom-3 right-4 text-blue-500/40 text-xs font-mono tracking-wider">
                      NAVTECH ClearWay{'\u2122'}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: partner info */}
            <AnimatedSection delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <Eye className="w-4 h-4" />
                Technology Partner
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Navtech Radar{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  (UK)
                </span>
              </h2>

              <p className="text-slate-400 leading-relaxed mb-6">
                Navtech Radar is a world-leading manufacturer of commercially
                deployed radar solutions. Their advanced W-Band and
                millimeter-wave radar sensors deliver unrivalled detection
                accuracy in all conditions, protecting some of the most
                sensitive sites on the planet.
              </p>

              <p className="text-slate-400 leading-relaxed mb-8">
                As the authorized integrator for the UAE and GCC, Melisa brings
                Navtech&apos;s proven technology together with local expertise to
                deliver turn-key perimeter security solutions \u2014 from initial
                survey through commissioning and ongoing maintenance.
              </p>

              <div className="flex flex-wrap gap-3">
                {['W-Band Radar', 'Millimeter Wave', 'FMCW Technology', 'IP67 Rated'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm border border-slate-700"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ====== WHY CHOOSE MELISA ====== */}
      <section className="relative py-24 bg-zinc-900/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Why Melisa
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why Choose{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Melisa
              </span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              Decades of regional expertise combined with world-class radar
              technology make Melisa your ideal perimeter security partner.
            </p>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-4">
            {whyChooseMelisa.map((item, i) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.text} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-start gap-5 p-5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/30 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold text-lg">{i + 1}.</span>
                      <p className="text-slate-200">{item.text}</p>
                    </div>
                  </motion.div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== PRODUCTS GRID ====== */}
      <section className="relative py-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="container mx-auto px-4">
          <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                Product Catalogue
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Radar{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Products
                </span>
              </h2>
              <p className="mt-2 text-slate-400">
                Explore our full range of Navtech Radar perimeter security
                systems.
              </p>
            </div>

            <span className="text-slate-500 text-sm whitespace-nowrap">
              Showing {products.length} of {totalProducts} products
            </span>
          </AnimatedSection>

          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <AnimatedSection key={product.id} delay={Math.min(i * 0.07, 0.6)}>
                  <RadarProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Radar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No products found</p>
            </div>
          )}

          {/* Back to products link */}
          <AnimatedSection className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to All Products
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-4 text-center">
          <AnimatedSection>
            <motion.div
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Get Started
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Secure Your Perimeter{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Today
                </span>
              </h2>

              <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
                Protect your critical infrastructure with next-generation radar
                technology. Contact our team for a site assessment and tailored
                security proposal.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg shadow-blue-500/20"
                >
                  <Phone className="w-5 h-5" />
                  Request a Consultation
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 px-8 py-4 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Browse All Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
