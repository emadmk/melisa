import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Download, FileText } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
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
    return { title: 'محصول یافت نشد' }
  }

  return {
    title: product.titleFa,
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
    { name: 'خانه', url: '/' },
    { name: 'محصولات', url: '/products' },
    ...(product.category ? [{ name: product.category.nameFa, url: `/products/category/${product.category.slug}` }] : []),
    { name: product.titleFa, url: `/products/${product.slug}` },
  ]

  const productSchema = generateProductSchema({
    name: product.titleFa,
    description: product.shortDesc || '',
    image: getImageUrl(product.image),
    brand: product.brand?.name,
    category: product.category?.nameFa,
    url: `https://hatefertebat.ir/products/${product.slug}`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Gallery - Right Side */}
              <div>
                <ProductGallery images={gallery.length > 0 ? gallery : [product.image || '']} title={product.titleFa} />
              </div>

              {/* Info - Left Side */}
              <div>
                {/* Category Badge */}
                {product.category && (
                  <Link
                    href={`/products/category/${product.category.slug}`}
                    className="inline-block text-sm text-primary bg-orange-50 px-3 py-1 rounded-full mb-4"
                  >
                    {product.category.nameFa}
                  </Link>
                )}

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-dark mb-2">
                  {product.titleFa}
                </h1>

                {product.titleEn && (
                  <p className="text-gray-400 mb-4" dir="ltr">
                    {product.titleEn}
                  </p>
                )}

                {/* Brand */}
                {product.brand && (
                  <Link
                    href={`/brands/${product.brand.slug}`}
                    className="inline-flex items-center gap-3 mb-4 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {product.brand.logo && (
                      <div className="relative w-16 h-10 flex-shrink-0">
                        <Image
                          src={product.brand.logo}
                          alt={product.brand.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      برند: <span className="font-medium text-primary">{product.brand.name}</span>
                    </span>
                  </Link>
                )}

                {/* Short Description */}
                {product.shortDesc && (
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.shortDesc}
                  </p>
                )}

                {/* Full Description */}
                {product.fullDesc && (
                  <div
                    className="prose prose-sm max-w-none text-gray-600 mb-6"
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
                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      دریافت کاتالوگ
                    </a>
                  )}

                  <Link
                    href="#inquiry"
                    className="inline-flex items-center gap-2 border-2 border-primary text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    استعلام قیمت
                  </Link>

                  <PrintButton />
                </div>

                {/* Attributes */}
                {attributes.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-dark mb-4">ویژگی‌ها:</h3>
                    <ul className="space-y-2">
                      {attributes.map((attr, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>
                            {attr.key} {attr.value}
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
          <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-dark mb-8">محصولات مشابه</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} showCompare={false} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inquiry Form */}
        <div id="inquiry" className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-dark mb-2 text-center">فرم درخواست قیمت</h2>
              <p className="text-gray-500 text-center mb-8">
                برای دریافت قیمت و مشاوره، فرم زیر را تکمیل کنید
              </p>
              <InquiryForm productId={product.id} productTitle={product.titleFa} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
