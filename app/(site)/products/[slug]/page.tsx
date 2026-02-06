import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Download, FileText, ArrowRight, Package, Tag, ChevronRight, Home, CheckCircle } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import InquiryForm from '@/components/forms/InquiryForm'
import ProductGallery from '@/components/products/ProductGallery'
import PrintButton from '@/components/products/PrintButton'
import { getImageUrl } from '@/lib/utils'
import { generateProductSchema } from '@/lib/seo'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface RelatedProduct {
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

async function getProduct(slug: string) {
  // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  const product = await prisma.product.findUnique({
    where: { slug: encodedSlug },
    include: {
      category: { select: { id: true, nameFa: true, nameEn: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true, logo: true } },
    },
  })

  return product
}

async function getRelatedProducts(categoryId: string | null, currentProductId: string): Promise<RelatedProduct[]> {
  if (!categoryId) return []

  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      status: 'PUBLISHED',
    },
    include: {
      category: { select: { nameFa: true, slug: true } },
      brand: { select: { name: true, slug: true, logo: true } },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return (products as RawProduct[]).map((p) => ({
    id: p.id,
    titleFa: p.titleFa,
    titleEn: p.titleEn,
    slug: p.slug,
    shortDesc: p.shortDesc,
    image: p.image,
    category: p.category,
    brand: p.brand,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Product not found' }
  }

  return {
    title: `${product.titleFa} | Melisa Trading`,
    description: product.shortDesc || undefined,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  // Parse attributes from JSON string if needed
  let attributes: { key: string; value: string }[] = []
  if (product.attributes) {
    try {
      const parsed = typeof product.attributes === 'string'
        ? JSON.parse(product.attributes)
        : product.attributes
      if (Array.isArray(parsed)) {
        attributes = parsed
      }
    } catch {
      // Invalid JSON, ignore
    }
  }

  // Parse gallery from JSON string if needed
  let gallery: string[] = []
  if (product.gallery) {
    try {
      const parsed = typeof product.gallery === 'string'
        ? JSON.parse(product.gallery)
        : product.gallery
      if (Array.isArray(parsed)) {
        gallery = parsed
      }
    } catch {
      // Invalid JSON, ignore
    }
  }

  const breadcrumbItems = [
    { name: 'Products', url: '/products' },
    ...(product.category ? [{ name: product.category.nameFa, url: `/products/category/${product.category.slug}` }] : []),
    { name: product.titleFa, url: `/products/${product.slug}` },
  ]

  const productSchema = generateProductSchema({
    name: product.titleFa,
    description: product.shortDesc || '',
    image: getImageUrl(product.image),
    brand: product.brand?.name,
    category: product.category?.nameFa,
    url: `https://melisa.ae/products/${product.slug}`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              {breadcrumbItems.map((item, index) => (
                <div key={item.url} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">{item.name}</span>
                  ) : (
                    <Link href={item.url} className="text-slate-400 hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Gallery */}
              <div>
                <ProductGallery images={gallery.length > 0 ? gallery : [product.image || '']} title={product.titleFa} />
              </div>

              {/* Info */}
              <div>
                {/* Category Badge */}
                {product.category && (
                  <Link
                    href={`/products/category/${product.category.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4 hover:bg-primary/20 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    {product.category.nameFa}
                  </Link>
                )}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                  {product.titleFa}
                </h1>

                {product.titleEn && (
                  <p className="text-slate-400 text-lg mb-4" dir="ltr">
                    {product.titleEn}
                  </p>
                )}

                {/* Brand */}
                {product.brand && (
                  <Link
                    href={`/brands/${product.brand.slug}`}
                    className="inline-flex items-center gap-4 mb-6 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    {product.brand.logo && (
                      <div className="relative w-20 h-12 flex-shrink-0 bg-white rounded-lg border border-slate-200 p-2">
                        <Image
                          src={product.brand.logo}
                          alt={product.brand.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <span className="text-slate-600 group-hover:text-primary transition-colors">
                      Brand: <span className="font-semibold">{product.brand.name}</span>
                    </span>
                  </Link>
                )}

                {/* Short Description */}
                {product.shortDesc && (
                  <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    {product.shortDesc}
                  </p>
                )}

                {/* Full Description */}
                {product.fullDesc && (
                  <div
                    className="prose prose-slate max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: product.fullDesc }}
                  />
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {product.catalogFile && (
                    <a
                      href={product.catalogFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                    >
                      <Download className="w-5 h-5" />
                      Download Catalog
                    </a>
                  )}

                  <Link
                    href="#inquiry"
                    className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Request Quote
                  </Link>

                  <PrintButton />
                </div>

                {/* Attributes */}
                {attributes.length > 0 && (
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Features & Specifications
                    </h3>
                    <ul className="space-y-3">
                      {attributes.map((attr, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong className="text-slate-900">{attr.key}:</strong> {attr.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 sm:py-16 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Related Products</h2>
                  <p className="text-slate-500 mt-1">You might also be interested in</p>
                </div>
                {product.category && (
                  <Link
                    href={`/products/category/${product.category.slug}`}
                    className="hidden sm:inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} showCompare={false} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Inquiry Form */}
        <section id="inquiry" className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <FileText className="w-4 h-4" />
                  Get a Quote
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Price Request Form</h2>
                <p className="text-slate-500">
                  Fill out the form below to receive pricing and consultation
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <InquiryForm productId={product.id} productTitle={product.titleFa} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
