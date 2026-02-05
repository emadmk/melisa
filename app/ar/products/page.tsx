import { Metadata } from 'next'
import ProductCard from '@/components/products/ProductCard'
import { Breadcrumb, Pagination } from '@/components/common'
import CategorySidebar from '@/components/products/CategorySidebar'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'المنتجات',
  description: 'تصفح جميع منتجات ميليسا بما في ذلك كاميرات المراقبة وأنظمة التحكم في الوصول والمعدات اللاسلكية وأنظمة النداء',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

interface RawCategory {
  id: string
  nameFa: string
  nameAr: string | null
  slug: string
  _count: { products: number }
}

interface Product {
  id: string
  titleFa: string
  titleEn?: string | null
  titleAr?: string | null
  slug: string
  shortDesc?: string | null
  shortDescAr?: string | null
  image?: string | null
  category?: { nameFa: string; nameAr?: string | null; slug: string } | null
  brand?: { name: string; slug: string; logo?: string | null } | null
}

interface RawProduct {
  id: string
  titleFa: string
  titleEn: string | null
  titleAr: string | null
  slug: string
  shortDesc: string | null
  shortDescAr: string | null
  image: string | null
  category: { id: string; nameFa: string; nameAr: string | null; nameEn: string | null; slug: string } | null
  brand: { id: string; name: string; slug: string; logo: string | null } | null
}

async function getProducts(page: number = 1, limit: number = 12) {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, nameFa: true, nameAr: true, nameEn: true, slug: true } },
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
    titleFa: p.titleAr || p.titleFa,
    titleEn: p.titleEn,
    titleAr: p.titleAr,
    slug: p.slug,
    shortDesc: p.shortDescAr || p.shortDesc,
    shortDescAr: p.shortDescAr,
    image: p.image,
    category: p.category ? { nameFa: p.category.nameAr || p.category.nameFa, nameAr: p.category.nameAr, slug: p.category.slug } : null,
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug, logo: p.brand.logo } : null,
  }))

  return {
    products: mappedProducts,
    totalPages: Math.ceil(total / limit),
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
    nameFa: cat.nameAr || cat.nameFa,
    slug: cat.slug,
    count: cat._count.products,
  }))
}

export default async function ProductsPageAr({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)

  const [{ products, totalPages }, categories] = await Promise.all([
    getProducts(currentPage),
    getCategories(),
  ])

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'المنتجات', url: '/ar/products' },
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
          <h1 className="text-3xl font-bold text-dark text-center">المنتجات</h1>
          <p className="text-gray-500 text-center mt-2">
            تصفح كتالوج منتجاتنا الكامل
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row-reverse gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <CategorySidebar categories={categories} locale="ar" />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showCompare={false} locale="ar" />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/ar/products" />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
