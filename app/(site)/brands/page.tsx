import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Award, Package } from 'lucide-react'
import { PageHero } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  description: string | null
  _count: { products: number }
}

export const metadata: Metadata = {
  title: 'Our Partners | Melisa Trading',
  description: 'Official partner and distributor of Motorola Solutions, Avigilon, Cambium Networks, SIAE Microelettronica and NEUMANN Elektronik in the UAE',
}

async function getBrands() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
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

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {brands.length === 0 ? (
          <div className="text-center py-16">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No brands found</h3>
            <p className="text-slate-500">Check back later for brand updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20"
              >
                {/* Logo */}
                <div className="relative w-full h-20 sm:h-24 mb-6 flex items-center justify-center">
                  <Image
                    src={brand.logo || '/images/brands/default.png'}
                    alt={brand.name}
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {brand.name}
                  </h2>

                  {brand.description && (
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {brand.description}
                    </p>
                  )}

                  {/* Product Count */}
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-4">
                    <Package className="w-4 h-4" />
                    <span>{brand._count.products} Products</span>
                  </div>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    View Products
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
