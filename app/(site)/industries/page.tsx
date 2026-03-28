import { Metadata } from 'next'
import Link from 'next/link'
import {
  Factory,
  Flame,
  Anchor,
  Building2,
  Plane,
  Container,
  Zap,
  Landmark,
  Home,
  ArrowRight
} from 'lucide-react'
import { PageHero } from '@/components/common'

export const metadata: Metadata = {
  title: 'Industries We Serve | Melisa Trading',
  description: 'Melisa Trading provides telecommunications, PAGA, CCTV and security solutions for refineries, petrochemical plants, offshore platforms, steel industries, airports and more.',
}

const industries = [
  {
    title: 'Refineries',
    description: 'Advanced communication and safety systems for oil refining operations, ensuring reliable connectivity in hazardous environments.',
    icon: Factory,
    gradient: 'from-orange-600 to-red-700',
    image: '/images/industries/refineries.webp',
  },
  {
    title: 'Petrochemical Plants',
    description: 'Explosion-proof PAGA, radio and CCTV solutions designed for petrochemical processing facilities.',
    icon: Flame,
    gradient: 'from-amber-600 to-orange-700',
    image: '/images/industries/petrochemical.webp',
  },
  {
    title: 'Offshore Platforms',
    description: 'Marine-grade telecommunications and emergency notification systems for offshore oil & gas operations.',
    icon: Anchor,
    gradient: 'from-cyan-600 to-blue-700',
    image: '/images/industries/offshore.webp',
  },
  {
    title: 'Steel Industries',
    description: 'Rugged communication infrastructure built to withstand extreme heat and heavy industrial environments.',
    icon: Building2,
    gradient: 'from-slate-600 to-slate-800',
    image: '/images/industries/steel.webp',
  },
  {
    title: 'Airports, Transport & Infrastructure',
    description: 'Integrated security, surveillance and public address systems for airports and transportation hubs.',
    icon: Plane,
    gradient: 'from-sky-600 to-indigo-700',
    image: '/images/industries/airports.webp',
  },
  {
    title: 'Tank Farms',
    description: 'Specialized hazardous area communication and monitoring solutions for fuel storage facilities.',
    icon: Container,
    gradient: 'from-emerald-600 to-teal-700',
    image: '/images/industries/tankfarms.webp',
  },
  {
    title: 'Energy & Power Plants',
    description: 'Reliable SCADA-compatible communication systems for power generation and distribution facilities.',
    icon: Zap,
    gradient: 'from-yellow-500 to-amber-600',
    image: '/images/industries/energy.webp',
  },
  {
    title: 'Utilities & Public Infrastructure',
    description: 'Smart communication networks for water treatment, waste management and municipal services.',
    icon: Landmark,
    gradient: 'from-violet-600 to-purple-700',
    image: '/images/industries/utilities.webp',
  },
  {
    title: 'Smart Homes',
    description: 'Modern home automation, security cameras, access control and intercom systems for residential projects.',
    icon: Home,
    gradient: 'from-rose-500 to-pink-600',
    image: '/images/industries/smarthomes.webp',
  },
]

export default function IndustriesPage() {
  const breadcrumbItems = [
    { name: 'Industries', url: '/industries' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Industries We Serve"
        subtitle="Delivering world-class telecommunications, security and safety solutions across diverse industries"
        breadcrumbItems={breadcrumbItems}
        iconName="Building"
      />

      {/* Industries Grid */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((industry, index) => {
            const IconComponent = industry.icon
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-transparent hover:-translate-y-1"
              >
                {/* Image / Gradient Background */}
                <div className={`relative h-48 sm:h-52 bg-gradient-to-br ${industry.gradient} overflow-hidden`}>
                  {/* Grid Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                      backgroundSize: '30px 30px',
                    }}
                  />
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full" />

                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <IconComponent className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{(index + 1).toString().padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {industry.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {industry.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`h-1 bg-gradient-to-r ${industry.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Need a Solution for Your Industry?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Contact our experts to discuss custom telecommunications and security solutions tailored to your industry requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
