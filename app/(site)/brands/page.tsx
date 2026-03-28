import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Award, Package, Globe, ExternalLink, Shield } from 'lucide-react'
import { PageHero } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  description: string | null
  website: string | null
  _count: { products: number }
}

export const metadata: Metadata = {
  title: 'Our Partners | Melisa Trading',
  description: 'Official partner and distributor of Motorola Solutions, Avigilon, Cambium Networks, SIAE Microelettronica and NEUMANN Elektronik in the UAE',
}

const brandAccents: Record<string, string> = {
  avigilon: 'from-blue-600 to-cyan-600',
  'cambium-networks': 'from-emerald-600 to-teal-600',
  motorola: 'from-sky-600 to-blue-600',
  'siae-microelettronica': 'from-violet-600 to-purple-600',
  neumann: 'from-amber-600 to-orange-600',
}

async function getBrands() {
  const brands = await prisma.brand.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
  return brands as Brand[]
}

export default async function BrandsPage() {
  const brands = await getBrands()

  const breadcrumbItems = [
    { name: 'Partners', url: '/brands' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Our Partners"
        subtitle="Official partner and distributor of leading global telecommunications and security brands in the UAE"
        breadcrumbItems={breadcrumbItems}
        iconName="Award"
      />

      {/* Partners Grid */}
      <div className="container mx-auto px-4 py-10 sm:py-16">
        {brands.length === 0 ? (
          <div className="text-center py-16">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No partners found</h3>
            <p className="text-slate-500">Check back later for updates.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {brands.map((brand, index) => {
              const accent = brandAccents[brand.slug] || 'from-primary to-red-600'
              const isEven = index % 2 === 0

              return (
                <div
                  key={brand.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 hover:border-slate-200"
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Logo Side */}
                    <div className="relative lg:w-80 xl:w-96 flex-shrink-0 bg-slate-900 p-8 sm:p-10 flex flex-col items-center justify-center min-h-[200px]">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-10`} />
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                          backgroundSize: '24px 24px',
                        }}
                      />

                      {/* Logo */}
                      <div className="relative w-48 h-16 sm:h-20 mb-4">
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{brand.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Official Partner badge */}
                      <div className="relative inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Official Partner
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {brand.name}
                        </h2>
                        <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${accent}`} />
                      </div>

                      {brand.description && (
                        <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3 sm:line-clamp-none max-w-2xl">
                          {brand.description}
                        </p>
                      )}

                      {/* Stats & Actions */}
                      <div className="flex flex-wrap items-center gap-4">
                        <Link
                          href={`/brands/${brand.slug}`}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${accent} text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all`}
                        >
                          View Products
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        {brand.website && (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 transition-all"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}

                        <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                          <Package className="w-4 h-4" />
                          {brand._count.products} Products
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Interested in Our Partner Products?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Contact our certified team for expert guidance on choosing the right solution for your needs
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
