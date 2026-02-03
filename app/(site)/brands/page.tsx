import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
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
  title: 'برندها',
  description: 'نمایندگی رسمی برندهای Motorola، Avigilon، Cambium Networks و Industronic در ایران',
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
    { name: 'خانه', url: '/' },
    { name: 'برندها', url: '/brands' },
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
          <h1 className="text-3xl font-bold text-dark text-center">برندها</h1>
          <p className="text-gray-500 text-center mt-3 max-w-2xl mx-auto">
            نمایندگی رسمی برندهای معتبر جهانی در ایران
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">در حال حاضر برندی ثبت نشده است</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="relative w-40 h-24 mb-6 grayscale group-hover:grayscale-0 transition-all">
                  <Image
                    src={brand.logo || '/images/brands/default.png'}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <h2 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                  {brand.name}
                </h2>

                <p className="text-gray-600 mb-4">{brand.description || ''}</p>

                <span className="text-sm text-gray-400 mb-4">
                  {brand._count.products} محصول
                </span>

                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  مشاهده محصولات
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
