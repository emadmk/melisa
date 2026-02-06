import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Settings, Truck, Wrench, Cpu, ArrowRight, Camera, Radio, Shield, Headphones, Network, Volume2, Cog } from 'lucide-react'
import { PageHero } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Service {
  id: string
  slug: string
  titleFa: string
  shortDesc: string | null
  fullDesc: string | null
  icon: string | null
  image: string | null
}

export const metadata: Metadata = {
  title: 'Services | Melisa Trading',
  description: 'Melisa services including setup, equipment supply, installation and engineering of telecommunications and security systems',
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

export default async function ServicesPage() {
  const services = await getServices()

  const breadcrumbItems = [
    { name: 'Services', url: '/services' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Our Services"
        subtitle="With over 19 years of experience in telecommunications and security equipment, we offer comprehensive services to our customers"
        breadcrumbItems={breadcrumbItems}
        iconName="Cog"
      />

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <Cog className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No services found</h3>
            <p className="text-slate-500">Check back later for service updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon || 'Settings'] || Settings

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20"
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Image */}
                    <div className="relative w-full sm:w-48 md:w-56 h-48 sm:h-auto flex-shrink-0 bg-slate-100">
                      <Image
                        src={service.image || '/images/services/default.jpg'}
                        alt={service.titleFa}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent sm:bg-gradient-to-r" />

                      {/* Number Badge */}
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                          <IconComponent className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {service.titleFa}
                        </h2>
                      </div>

                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {service.shortDesc || ''}
                      </p>

                      <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all mt-auto">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
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
