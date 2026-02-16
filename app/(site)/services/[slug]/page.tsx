import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Camera, Radio, Shield, Headphones, Network, Volume2, Settings, Truck, Wrench, Cpu, ArrowRight, ChevronRight, Home, Phone, CheckCircle } from 'lucide-react'
import ServiceRequestForm from '@/components/forms/ServiceRequestForm'
import { prisma } from '@/lib/db'
import { siteConfig } from '@/lib/seo'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface OtherService {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  icon: string | null
  image: string | null
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera,
  Radio,
  Shield,
  Headphones,
  Network,
  Volume2,
  Settings,
  Truck,
  Wrench,
  Cpu,
}

function getTitle(titleEn: string | null | undefined, titleFa: string): string {
  return titleEn || titleFa
}

async function getService(slug: string) {
  // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  return prisma.service.findUnique({
    where: { slug: encodedSlug },
  })
}

async function getOtherServices(currentId: string): Promise<OtherService[]> {
  const services = await prisma.service.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: currentId },
    },
    select: { id: true, titleFa: true, titleEn: true, slug: true, icon: true, image: true },
    orderBy: { order: 'asc' },
    take: 4,
  })
  return services as OtherService[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) {
    return { title: 'Service not found' }
  }

  const title = getTitle(service.titleEn, service.titleFa)

  return {
    title: `${title} | Melisa Trading`,
    description: service.shortDesc || undefined,
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const service = await getService(slug)

  if (!service || service.status !== 'PUBLISHED') {
    notFound()
  }

  const otherServices = await getOtherServices(service.id)
  const IconComponent = iconMap[service.icon || ''] || Shield
  const title = getTitle(service.titleEn, service.titleFa)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden pt-32 sm:pt-36">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 pb-10 sm:pb-14 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <Link href="/services" className="text-slate-400 hover:text-primary transition-colors">
              Services
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-white font-medium">{title}</span>
          </nav>

          {/* Service Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-2xl flex items-center justify-center">
              <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{title}</h1>
              {service.shortDesc && (
                <p className="text-slate-300 text-lg max-w-2xl">{service.shortDesc}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Content - 2 columns */}
          <div className="lg:col-span-2">
            {/* Service Image */}
            {service.image && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
                <Image
                  src={service.image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                About This Service
              </h2>
              {service.fullDesc ? (
                <div
                  className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: service.fullDesc }}
                />
              ) : (
                <p className="text-slate-600 leading-relaxed text-lg">
                  {service.shortDesc}
                </p>
              )}
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 mt-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Why Choose Melisa?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  '19+ years of industry experience',
                  'Certified professional team',
                  'Premium equipment brands',
                  '24/7 technical support',
                  'Competitive pricing',
                  'Custom solutions available',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-primary to-red-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Need This Service?</h3>
              <p className="text-white/80 text-sm mb-6">
                Contact us for a free consultation and quote
              </p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3 bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors"
              >
                <Phone className="w-6 h-6" />
                <div>
                  <div className="text-sm opacity-80">Call Now</div>
                  <div className="font-semibold" dir="ltr">{siteConfig.phone}</div>
                </div>
              </a>
            </div>

            {/* Other Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Other Services</h3>
              <div className="space-y-3">
                {otherServices.map((s) => {
                  const SvcIcon = iconMap[s.icon || ''] || Shield
                  return (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow group-hover:bg-primary/10 transition-all">
                        <SvcIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-slate-700 font-medium group-hover:text-primary transition-colors">
                        {getTitle(s.titleEn, s.titleFa)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  )
                })}
              </div>
              <Link
                href="/services"
                className="flex items-center justify-center gap-2 mt-4 py-3 text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors"
              >
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Request Form */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <IconComponent className="w-4 h-4" />
                Request Service
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Get Started Today</h2>
              <p className="text-slate-500">
                Fill out the form below to request {title} service
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <ServiceRequestForm serviceTitle={title} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Have Questions About Our Services?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Our team is here to help you find the perfect solution for your needs
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
