import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Breadcrumb, Pagination } from '@/components/common'
import ProductCard from '@/components/products/ProductCard'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  titleFa: string
  titleEn?: string | null
  slug: string
  shortDesc?: string | null
  image?: string | null
  category?: { nameFa: string; slug: string } | null
  brand?: { name: string; slug: string; logo?: string | null } | null
}

interface RawProduct {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  shortDesc: string | null
  image: string | null
  category: { nameFa: string; slug: string } | null
  brand: { name: string; slug: string; logo: string | null } | null
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

async function getBrand(slug: string) {
  // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  return prisma.brand.findUnique({
    where: { slug: encodedSlug },
  })
}

async function getProductsByBrand(brandId: string, page: number = 1, limit: number = 12) {
  const [rawProducts, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        brandId,
        status: 'PUBLISHED',
      },
      include: {
        category: { select: { nameFa: true, slug: true } },
        brand: { select: { name: true, slug: true, logo: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({
      where: {
        brandId,
        status: 'PUBLISHED',
      },
    }),
  ])

  const products: Product[] = (rawProducts as RawProduct[]).map((p) => ({
    id: p.id,
    titleFa: p.titleFa,
    titleEn: p.titleEn,
    slug: p.slug,
    shortDesc: p.shortDesc,
    image: p.image,
    category: p.category,
    brand: p.brand,
  }))

  return { products, total, totalPages: Math.ceil(total / limit) }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const brand = await getBrand(slug)

  if (!brand) {
    return { title: 'Brand Not Found' }
  }

  return {
    title: `${brand.name} Products`,
    description: `View all products from ${brand.name}`,
  }
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)

  const brand = await getBrand(slug)

  if (!brand) {
    notFound()
  }

  const { products, total, totalPages } = await getProductsByBrand(brand.id, currentPage)

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Brands', url: '/brands' },
    { name: brand.name, url: `/brands/${brand.slug}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          {brand.logo && (
            <div className="relative w-48 h-24 mx-auto mb-6">
              <Image src={brand.logo} alt={brand.name} fill className="object-contain" unoptimized />
            </div>
          )}
          <h1 className="text-3xl font-bold text-dark mb-4">{brand.name}</h1>
          <p className="text-gray-500">{total} Products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-dark mb-8">{brand.name} Products</h2>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products found for this brand
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showCompare={false} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/brands/${slug}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
