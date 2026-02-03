import { Metadata } from 'next'
import Image from 'next/image'
import { Award, Users, Building, Calendar } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { siteConfig } from '@/lib/seo'
import prisma from '@/lib/db'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
}

async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
      },
      orderBy: { name: 'asc' },
    })
    return brands
  } catch {
    return []
  }
}

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Melisa - Over 15 years of experience in telecommunications and security equipment in Dubai, UAE',
}

const stats = [
  { icon: Calendar, label: 'Years Experience', value: '15+' },
  { icon: Building, label: 'Successful Projects', value: '500+' },
  { icon: Users, label: 'Satisfied Clients', value: '300+' },
  { icon: Award, label: 'Trusted Brands', value: '5' },
]

export default async function AboutPage() {
  const brands = await getBrands()

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-dark text-center">About Us</h1>
          <p className="text-gray-500 text-center mt-3">Learn more about {siteConfig.name}</p>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">About Melisa</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Communication is a process in which information is transferred from source to destination.
              This telecommunications company specializes in telecommunications, radio, CCTV, and paging projects.
              With advanced technology, the company provides high-quality and secure communication and information exchange services to its customers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              The company has the ability to design, implement, and install complex and advanced telecommunications and radio projects.
              It also continuously invests in research and development of new technologies in the industry.
              Additionally, the company is involved in the CCTV field and can provide security and surveillance services using modern CCTV equipment.
            </p>
            <p className="text-gray-600 leading-relaxed">
              In the paging field, it offers communication and messaging services.
              With strong technical expertise and experience, the company has established effective and sustainable communication with its customers and achieved excellence in the telecommunications and communication industry.
            </p>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-us-img.webp"
                alt="Melisa Telecommunications"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm opacity-90">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-dark mb-1">{stat.value}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-dark text-center mb-8">Our Partner Brands</h2>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {brands.map((brand) => (
              brand.logo && (
                <div key={brand.id} className="relative w-32 h-20 grayscale hover:grayscale-0 transition-all">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
