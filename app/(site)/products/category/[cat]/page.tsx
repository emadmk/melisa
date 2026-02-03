import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import { Breadcrumb, Pagination } from '@/components/common'
import CategorySidebar from '@/components/products/CategorySidebar'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ cat: string }>
  searchParams: Promise<{ page?: string }>
}

interface RawCategory {
  id: string
  nameFa: string
  nameEn: string | null
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

async function getCategory(slug: string) {
  // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  return prisma.category.findUnique({
    where: { slug: encodedSlug },
  })
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
    nameEn: cat.nameEn,
    slug: cat.slug,
    count: cat._count.products,
  }))
}

async function getProductsByCategory(categorySlug: string, page: number = 1, limit: number = 12) {
  // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
  const encodedSlug = encodeURIComponent(categorySlug).toLowerCase()
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        category: { slug: encodedSlug },
        status: 'PUBLISHED',
      },
      include: {
        category: { select: { id: true, nameFa: true, nameEn: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true, logo: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({
      where: {
        category: { slug: encodedSlug },
        status: 'PUBLISHED',
      },
    }),
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
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params
  const category = await getCategory(cat)

  if (!category) {
    return { title: 'دسته‌بندی یافت نشد' }
  }

  return {
    title: category.nameFa,
    description: category.description || `مشاهده محصولات دسته ${category.nameFa}`,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { cat } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)

  const [category, categories, { products, totalPages }] = await Promise.all([
    getCategory(cat),
    getCategories(),
    getProductsByCategory(cat, currentPage),
  ])

  if (!category) {
    notFound()
  }

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'محصولات', url: '/products' },
    { name: category.nameFa, url: `/products/category/${category.slug}` },
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
          <h1 className="text-3xl font-bold text-dark text-center">{category.nameFa}</h1>
          <p className="text-gray-500 text-center mt-2">
            در این قسمت می‌توانید تمامی محصولات را مشاهده نمایید
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <CategorySidebar categories={categories} currentSlug={cat} />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} showCompare={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">محصولی در این دسته‌بندی یافت نشد</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/products/category/${cat}`} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
