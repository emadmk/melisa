import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Package, ArrowRight, ChevronRight, Home } from 'lucide-react'
import { Pagination } from '@/components/common'
import ProductCard from '@/components/products/ProductCard'
import NeumannBrandPage from '@/components/brands/NeumannBrandPage'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// List of brands with special themed pages
const THEMED_BRANDS = ['neumann']

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

async function getAllProductsByBrand(brandId: string) {
  const rawProducts = await prisma.product.findMany({
    where: {
      brandId,
      status: 'PUBLISHED',
    },
    include: {
      category: { select: { nameFa: true, slug: true } },
      brand: { select: { name: true, slug: true, logo: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

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

  // Get unique categories with counts
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>()
  products.forEach(p => {
    if (p.category) {
      const existing = categoryMap.get(p.category.slug)
      if (existing) {
        existing.count++
      } else {
        categoryMap.set(p.category.slug, {
          name: p.category.nameFa,
          slug: p.category.slug,
          count: 1
        })
      }
    }
  })

  const categories = Array.from(categoryMap.values())

  return { products, total: products.length, categories }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const brand = await getBrand(slug)

  if (!brand) {
    return { title: 'Brand Not Found' }
  }

  return {
    title: `${brand.name} Products | Melisa Trading`,
    description: brand.description || `View all products from ${brand.name}`,
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

  // Check if this is a themed brand (like Neumann)
  const isThemedBrand = THEMED_BRANDS.includes(brand.slug.toLowerCase())

  if (isThemedBrand && brand.slug.toLowerCase() === 'neumann') {
    // Get all products for themed page (no pagination, client-side filtering)
    const { products, total, categories } = await getAllProductsByBrand(brand.id)

    return (
      <NeumannBrandPage
        brand={{
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          description: brand.description,
        }}
        products={products}
        categories={categories}
        total={total}
      />
    )
  }

  // Regular brand page
  const { products, total, totalPages } = await getProductsByBrand(brand.id, currentPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden pt-32 sm:pt-36">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 pb-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <Link href="/brands" className="text-slate-400 hover:text-primary transition-colors">
              Brands
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-white font-medium">{brand.name}</span>
          </nav>

          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 py-8 sm:py-12">
            {brand.logo && (
              <div className="relative w-40 h-24 sm:w-56 sm:h-32 bg-white rounded-2xl p-4 shadow-xl">
                <Image src={brand.logo} alt={brand.name} fill className="object-contain p-2" unoptimized />
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{brand.name}</h1>
              {brand.description && (
                <p className="text-slate-300 max-w-xl mb-4">{brand.description}</p>
              )}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white">
                <Package className="w-5 h-5 text-primary" />
                <span className="font-medium">{total} Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{brand.name} Products</h2>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 mb-6">Check back later for new products from {brand.name}</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              Browse All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showCompare={false} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10">
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

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Need Help with {brand.name} Products?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Our team of experts can help you choose the right equipment for your needs
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
