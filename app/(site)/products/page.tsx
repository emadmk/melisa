import { Metadata } from 'next'
import ProductCard from '@/components/products/ProductCard'
import { PageHero, Pagination } from '@/components/common'
import CategorySidebar from '@/components/products/CategorySidebar'
import { prisma } from '@/lib/db'
import { Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products | Melisa Trading',
  description: 'Browse our complete catalog of telecommunications equipment, security cameras, radio systems, and wireless solutions.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

interface RawCategory {
  id: string
  nameFa: string
  slug: string
  _count: { products: number }
}

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
  category: { id: string; nameFa: string; nameEn: string | null; slug: string } | null
  brand: { id: string; name: string; slug: string; logo: string | null } | null
}

async function getProducts(page: number = 1, limit: number = 12) {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, nameFa: true, nameEn: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true, logo: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
  ])

  const mappedProducts: Product[] = (products as RawProduct[]).map((p) => ({
    id: p.id,
    titleFa: p.titleFa,
    titleEn: p.titleEn,
    slug: p.slug,
    shortDesc: p.shortDesc,
    image: p.image,
    category: p.category ? { nameFa: p.category.nameFa, slug: p.category.slug } : null,
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug, logo: p.brand.logo } : null,
  }))

  return {
    products: mappedProducts,
    totalPages: Math.ceil(total / limit),
    total,
  }
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { nameFa: 'asc' },
  })

  return (categories as RawCategory[]).map((cat) => ({
    id: cat.id,
    nameFa: cat.nameFa,
    slug: cat.slug,
    count: cat._count.products,
  }))
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)

  const [{ products, totalPages, total }, categories] = await Promise.all([
    getProducts(currentPage),
    getCategories(),
  ])

  const breadcrumbItems = [
    { name: 'Products', url: '/products' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Our Products"
        subtitle={`Explore our comprehensive catalog of ${total}+ telecommunications and security products`}
        breadcrumbItems={breadcrumbItems}
        iconName="Package"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-32">
              <CategorySidebar categories={categories} />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600 text-sm">
                Showing <span className="font-medium text-slate-900">{products.length}</span> of{' '}
                <span className="font-medium text-slate-900">{total}</span> products
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showCompare={false} />
              ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500">Check back later for new products.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/products" />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
