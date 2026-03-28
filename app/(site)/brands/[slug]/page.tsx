import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Package, ArrowRight, ChevronRight, Home, Globe, ExternalLink, Building2, Shield } from 'lucide-react'
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
    title: `${brand.name} | Partner - Melisa Trading`,
    description: brand.description || `Official partner for ${brand.name} products in the UAE. View all products, solutions, and contact us for inquiries.`,
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

  const brandAccents: Record<string, string> = {
    avigilon: 'from-blue-600/20 to-cyan-600/10',
    'cambium-networks': 'from-emerald-600/20 to-teal-600/10',
    motorola: 'from-sky-600/20 to-blue-600/10',
    'siae-microelettronica': 'from-violet-600/20 to-purple-600/10',
    neumann: 'from-amber-600/20 to-orange-600/10',
  }
  const accentGradient = brandAccents[brand.slug] || 'from-primary/20 to-red-600/10'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-slate-900 relative overflow-hidden pt-32 sm:pt-36">
        {/* Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${accentGradient}`} />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Red Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="container mx-auto px-4 pb-10 sm:pb-14 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-10">
            <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <Link href="/brands" className="text-slate-400 hover:text-primary transition-colors">
              Partners
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-white font-medium">{brand.name}</span>
          </nav>

          {/* Brand Info - Centered Layout */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Logo */}
            {brand.logo && (
              <div className="relative w-48 h-14 sm:w-60 sm:h-16 mx-auto mb-6">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain brightness-0 invert opacity-90"
                  unoptimized
                />
              </div>
            )}

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 rounded-full text-primary text-xs font-semibold mb-4">
              <Shield className="w-3.5 h-3.5" />
              Official Partner
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{brand.name}</h1>

            {/* Short description under title */}
            {brand.description && (
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6 line-clamp-2 max-w-2xl mx-auto">
                {brand.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-full text-white text-sm font-medium">
                <Package className="w-4 h-4 text-primary" />
                {total} Products
              </div>
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  Official Website
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
              fill="rgb(249 250 251)"
            />
          </svg>
        </div>
      </div>

      {/* About Partner Section */}
      {brand.description && (
        <section className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 py-8 sm:py-10">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">About {brand.name}</h2>
                <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                  {brand.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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
            As an official partner, our team of certified experts can help you choose the right {brand.name} equipment for your needs
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
