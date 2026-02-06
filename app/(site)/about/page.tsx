import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Users, Building, Calendar, ArrowRight, Shield, Radio, Camera, Headphones } from 'lucide-react'
import { PageHero } from '@/components/common'
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
  title: 'About Us | Melisa Trading',
  description: 'Learn about Melisa - Over 19 years of experience in telecommunications and security equipment in Dubai, UAE',
}

const stats = [
  { icon: Calendar, label: 'Years Experience', value: '19+' },
  { icon: Building, label: 'Successful Projects', value: '500+' },
  { icon: Users, label: 'Satisfied Clients', value: '300+' },
  { icon: Award, label: 'Trusted Brands', value: '5' },
]

const capabilities = [
  {
    icon: Radio,
    title: 'Radio Communication',
    description: 'Professional two-way radio systems for seamless team coordination',
  },
  {
    icon: Camera,
    title: 'CCTV & Surveillance',
    description: 'Advanced security monitoring with AI-powered analytics',
  },
  {
    icon: Shield,
    title: 'Security Systems',
    description: 'Complete access control and intrusion detection solutions',
  },
  {
    icon: Headphones,
    title: 'PA & Paging',
    description: 'Public address and emergency notification systems',
  },
]

export default async function AboutPage() {
  const brands = await getBrands()

  const breadcrumbItems = [
    { name: 'About Us', url: '/about' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="About Us"
        subtitle={`Learn more about ${siteConfig.name} - Your trusted partner in telecommunications and security solutions since 2005`}
        breadcrumbItems={breadcrumbItems}
        iconName="Building"
      />

      {/* About Content */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Building className="w-4 h-4" />
                Our Story
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Leading Telecommunications Solutions in the UAE
              </h2>
              <div className="space-y-4 text-slate-600">
                <p className="leading-relaxed">
                  Communication is a process in which information is transferred from source to destination.
                  This telecommunications company specializes in telecommunications, radio, CCTV, and paging projects.
                  With advanced technology, the company provides high-quality and secure communication and information exchange services to its customers.
                </p>
                <p className="leading-relaxed">
                  The company has the ability to design, implement, and install complex and advanced telecommunications and radio projects.
                  It also continuously invests in research and development of new technologies in the industry.
                  Additionally, the company is involved in the CCTV field and can provide security and surveillance services using modern CCTV equipment.
                </p>
                <p className="leading-relaxed">
                  In the paging field, it offers communication and messaging services.
                  With strong technical expertise and experience, the company has established effective and sustainable communication with its customers and achieved excellence in the telecommunications and communication industry.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors group"
              >
                Get In Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-us-img.webp"
                  alt="Melisa Telecommunications"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
              {/* Stats Overlay */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-3xl sm:text-4xl font-bold text-primary">19+</div>
                <div className="text-sm text-slate-500">Years of Excellence</div>
              </div>
              {/* Secondary Badge */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-primary text-white p-3 sm:p-4 rounded-xl shadow-lg">
                <Award className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm sm:text-base">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Our Expertise
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              What We Do Best
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We specialize in providing comprehensive telecommunications and security solutions for businesses across the UAE
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, index) => {
              const IconComponent = cap.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <IconComponent className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{cap.title}</h3>
                  <p className="text-slate-500 text-sm">{cap.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partner Brands */}
      {brands.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Our Partner Brands</h2>
              <p className="text-slate-500">Trusted partnerships with industry leaders</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {brands.map((brand) => (
                brand.logo && (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    className="relative w-24 sm:w-32 h-16 sm:h-20 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </Link>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary to-red-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Contact us today to discuss your telecommunications and security needs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
