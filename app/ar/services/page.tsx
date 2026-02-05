import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Settings, Truck, Wrench, Cpu, ArrowRight, Camera, Radio, Shield, Headphones, Network, Volume2 } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Service {
  id: string
  slug: string
  titleFa: string
  titleAr: string | null
  shortDesc: string | null
  shortDescAr: string | null
  fullDesc: string | null
  icon: string | null
  image: string | null
}

export const metadata: Metadata = {
  title: 'خدماتنا',
  description: 'خدمات ميليسا تشمل التوريد والتركيب والهندسة لأنظمة الاتصالات والأمن',
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera, Radio, Shield, Headphones, Network, Volume2, Settings, Truck, Wrench, Cpu,
}

async function getServices(): Promise<Service[]> {
  const services = await prisma.service.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
  })
  return services as Service[]
}

export default async function ServicesPageAr() {
  const services = await getServices()

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'خدماتنا', url: '/ar/services' },
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
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-dark text-center">خدماتنا</h1>
          <p className="text-gray-500 text-center mt-3 max-w-2xl mx-auto">
            بخبرة تزيد عن 18 عاماً في مجال معدات الاتصالات والأمن، نقدم خدمات شاملة لعملائنا
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-12">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد خدمات مسجلة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon || 'Settings'] || Settings
              const title = service.titleAr || service.titleFa
              const description = service.shortDescAr || service.shortDesc || ''

              return (
                <Link
                  key={service.id}
                  href={`/ar/services/${service.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row-reverse">
                    {/* Image */}
                    <div className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-gray-100">
                      <Image
                        src={service.image || '/images/services/default.jpg'}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">
                          {title}
                        </h2>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {description}
                      </p>

                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        اقرأ المزيد
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
