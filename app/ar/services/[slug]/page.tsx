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

interface Service {
  id: string
  titleFa: string
  titleAr: string | null
  slug: string
  shortDesc: string | null
  shortDescAr: string | null
  fullDesc: string | null
  fullDescAr: string | null
  icon: string | null
  status: string
}

interface OtherService {
  id: string
  titleFa: string
  titleAr: string | null
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

async function getService(slug: string): Promise<Service | null> {
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  const service = await prisma.service.findUnique({
    where: { slug: encodedSlug },
  })
  return service as Service | null
}

async function getOtherServices(currentId: string): Promise<OtherService[]> {
  const services = await prisma.service.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: currentId },
    },
    select: { id: true, titleFa: true, titleAr: true, slug: true, icon: true },
    orderBy: { order: 'asc' },
    take: 4,
  })
  return services as OtherService[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) {
    return { title: 'الخدمة غير موجودة' }
  }

  const title = service.titleAr || service.titleFa
  const description = service.shortDescAr || service.shortDesc

  return {
    title,
    description: description || undefined,
  }
}

export default async function ServicePageAr({ params }: PageProps) {
  const { slug } = await params
  const service = await getService(slug)

  if (!service || service.status !== 'PUBLISHED') {
    notFound()
  }

  const otherServices = await getOtherServices(service.id)
  const IconComponent = iconMap[service.icon || ''] || Shield

  const title = service.titleAr || service.titleFa
  const shortDesc = service.shortDescAr || service.shortDesc
  const fullDesc = service.fullDescAr || service.fullDesc

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'خدماتنا', url: '/ar/services' },
    { name: title, url: `/ar/services/${service.slug}` },
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
          <h1 className="text-3xl font-bold text-dark text-center">{title}</h1>
          <p className="text-gray-500 text-center mt-2">{shortDesc}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Content - 2 columns */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Icon */}
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <IconComponent className="w-10 h-10 text-primary" />
            </div>

            {/* Description */}
            {fullDesc ? (
              <div
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: fullDesc }}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed text-lg">
                {shortDesc}
              </p>
            )}
          </div>

          {/* Sidebar - Other Services */}
          <div className="bg-gray-50 rounded-xl p-6 order-1 lg:order-2">
            <h3 className="font-bold text-dark mb-4">خدمات أخرى:</h3>
            <div className="space-y-3">
              {otherServices.map((s) => {
                const SvcIcon = iconMap[s.icon || ''] || Shield
                const svcTitle = s.titleAr || s.titleFa
                return (
                  <Link
                    key={s.id}
                    href={`/ar/services/${s.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-primary hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SvcIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-dark font-medium group-hover:text-primary transition-colors">
                      {svcTitle}
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
            <h2 className="text-2xl font-bold text-dark mb-2 text-center">طلب الخدمة</h2>
            <p className="text-gray-500 text-center mb-8">
              املأ النموذج أدناه لطلب خدمة {title}
            </p>
            <ServiceRequestForm serviceTitle={title} locale="ar" />
          </div>
        </div>
      </div>
    </div>
  )
}
