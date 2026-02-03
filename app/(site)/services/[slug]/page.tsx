import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Camera, Radio, Shield, Headphones, Network, Volume2, Settings, Truck, Wrench, Cpu } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import ServiceRequestForm from '@/components/forms/ServiceRequestForm'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface OtherService {
  id: string
  titleFa: string
  slug: string
  icon: string | null
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
    select: { id: true, titleFa: true, slug: true, icon: true },
    orderBy: { order: 'asc' },
    take: 4,
  })
  return services as OtherService[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) {
    return { title: 'خدمت یافت نشد' }
  }

  return {
    title: service.titleFa,
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

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'خدمات', url: '/services' },
    { name: service.titleFa, url: `/services/${service.slug}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark text-center">{service.titleFa}</h1>
          <p className="text-gray-500 text-center mt-2">{service.shortDesc}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Content - 2 columns */}
          <div className="lg:col-span-2">
            {/* Icon */}
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <IconComponent className="w-10 h-10 text-primary" />
            </div>

            {/* Description */}
            {service.fullDesc ? (
              <div
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: service.fullDesc }}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed text-lg">
                {service.shortDesc}
              </p>
            )}
          </div>

          {/* Sidebar - Other Services */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-dark mb-4">دیگر خدمات:</h3>
            <div className="space-y-3">
              {otherServices.map((s) => {
                const SvcIcon = iconMap[s.icon || ''] || Shield
                return (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-primary hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SvcIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-dark font-medium group-hover:text-primary transition-colors">
                      {s.titleFa}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Request Form */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-dark mb-2 text-center">درخواست خدمات</h2>
            <p className="text-gray-500 text-center mb-8">
              برای درخواست خدمات {service.titleFa}، فرم زیر را تکمیل کنید
            </p>
            <ServiceRequestForm serviceTitle={service.titleFa} />
          </div>
        </div>
      </div>
    </div>
  )
}
