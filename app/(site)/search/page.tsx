import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Package, FileText, Wrench } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

interface ProductResult {
  id: string
  titleFa: string
  slug: string
  image: string | null
  category: { nameFa: string } | null
}

interface PostResult {
  id: string
  titleFa: string
  slug: string
  excerpt: string | null
}

interface ServiceResult {
  id: string
  titleFa: string
  slug: string
  shortDesc: string | null
}

export const metadata: Metadata = {
  title: 'جستجو',
  description: 'جستجو در محصولات، مقالات و خدمات کرمان هاتف ارتباط',
}

async function searchProducts(query: string): Promise<ProductResult[]> {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { titleFa: { contains: query, mode: 'insensitive' } },
        { titleEn: { contains: query, mode: 'insensitive' } },
        { shortDesc: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      category: { select: { nameFa: true } },
    },
    take: 8,
  })
  return products as ProductResult[]
}

async function searchPosts(query: string): Promise<PostResult[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { titleFa: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      titleFa: true,
      slug: true,
      excerpt: true,
    },
    take: 5,
  })
  return posts as PostResult[]
}

async function searchServices(query: string): Promise<ServiceResult[]> {
  const services = await prisma.service.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { titleFa: { contains: query, mode: 'insensitive' } },
        { shortDesc: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      titleFa: true,
      slug: true,
      shortDesc: true,
    },
    take: 5,
  })
  return services as ServiceResult[]
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams
  const hasSearched = !!query && query.trim().length > 0

  let products: ProductResult[] = []
  let posts: PostResult[] = []
  let services: ServiceResult[] = []

  if (hasSearched) {
    const searchQuery = query.trim()
    ;[products, posts, services] = await Promise.all([
      searchProducts(searchQuery),
      searchPosts(searchQuery),
      searchServices(searchQuery),
    ])
  }

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'جستجو', url: '/search' },
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
          <h1 className="text-3xl font-bold text-dark text-center mb-6">جستجو</h1>

          <form action="/search" method="GET" className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={query || ''}
                placeholder="نام محصول، خدمات یا مقاله را جستجو کنید..."
                className="w-full px-6 py-4 pr-14 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!hasSearched ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              عبارت مورد نظر خود را جستجو کنید
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Products */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-dark">محصولات</h2>
                <span className="text-sm text-gray-400">({products.length} نتیجه)</span>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                    >
                      <div className="relative aspect-square bg-gray-50">
                        <Image
                          src={product.image || '/images/products/default.jpg'}
                          alt={product.titleFa}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-primary">{product.category?.nameFa || ''}</span>
                        <h3 className="font-medium text-dark mt-1 group-hover:text-primary transition-colors">
                          {product.titleFa}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">محصولی یافت نشد</p>
              )}
            </div>

            {/* Posts */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-dark">مقالات</h2>
                <span className="text-sm text-gray-400">({posts.length} نتیجه)</span>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group"
                    >
                      <h3 className="font-bold text-dark group-hover:text-primary transition-colors mb-2">
                        {post.titleFa}
                      </h3>
                      <p className="text-gray-600 text-sm">{post.excerpt || ''}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">مقاله‌ای یافت نشد</p>
              )}
            </div>

            {/* Services */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Wrench className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-dark">خدمات</h2>
                <span className="text-sm text-gray-400">({services.length} نتیجه)</span>
              </div>

              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group"
                    >
                      <h3 className="font-bold text-dark group-hover:text-primary transition-colors mb-2">
                        {service.titleFa}
                      </h3>
                      <p className="text-gray-600 text-sm">{service.shortDesc || ''}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">خدماتی یافت نشد</p>
              )}
            </div>

            {/* No Results */}
            {products.length === 0 && posts.length === 0 && services.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  نتیجه‌ای برای &quot;{query}&quot; یافت نشد
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
