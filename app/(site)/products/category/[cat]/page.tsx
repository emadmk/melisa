import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import { Breadcrumb, Pagination } from '@/components/common'
import CategorySidebar from '@/components/products/CategorySidebar'
import CCTVCategoryPage from '@/components/categories/CCTVCategoryPage'
import RadarCategoryPage from '@/components/categories/RadarCategoryPage'
import RadioCategoryPage from '@/components/categories/RadioCategoryPage'
import MicrowaveCategoryPage from '@/components/categories/MicrowaveCategoryPage'
import FiberCategoryPage from '@/components/categories/FiberCategoryPage'
import PAGACategoryPage from '@/components/categories/PAGACategoryPage'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Categories with special themed pages
const THEMED_CATEGORIES: Record<string, string> = {
  'paga': 'paga',
  'cctv': 'cctv',
  'radar-surveillance-system': 'radar',
  'radio': 'radio',
  'microwave': 'microwave',
  'otn-fiber': 'fiber',
}

// Map subcategories to their parent's theme
const SUBCATEGORY_TO_PARENT: Record<string, { parent: string; theme: string }> = {
  // PAGA subcategories
  'public-address-general-alarm': { parent: 'paga', theme: 'paga' },
  'industrial-intercom-systems': { parent: 'paga', theme: 'paga' },
  'speakers-siren': { parent: 'paga', theme: 'paga' },
  'paga-software-functions': { parent: 'paga', theme: 'paga' },
  'paga-software': { parent: 'paga', theme: 'paga' },
  'controllers-system-modules': { parent: 'paga', theme: 'paga' },
  'call-stations': { parent: 'paga', theme: 'paga' },
  'ds-6-controllers': { parent: 'paga', theme: 'paga' },
  'ds-22-controllers': { parent: 'paga', theme: 'paga' },
  'ds-6-call-stations': { parent: 'paga', theme: 'paga' },
  'ds-22-call-stations': { parent: 'paga', theme: 'paga' },
  // CCTV subcategories
  'fixed-ptz-cameras': { parent: 'cctv', theme: 'cctv' },
  'explosion-proof-cameras': { parent: 'cctv', theme: 'cctv' },
  'video-management-system': { parent: 'cctv', theme: 'cctv' },
  'security-cameras': { parent: 'cctv', theme: 'cctv' },
  'access-control': { parent: 'cctv', theme: 'cctv' },
  'explosion-proof': { parent: 'cctv', theme: 'cctv' },
  'outdoor': { parent: 'cctv', theme: 'cctv' },
  // Radar subcategories
  'perimeter-radars': { parent: 'radar-surveillance-system', theme: 'radar' },
  'intrusion-detection-systems': { parent: 'radar-surveillance-system', theme: 'radar' },
  'radar-cctv-integration': { parent: 'radar-surveillance-system', theme: 'radar' },
  // Radio subcategories
  'tetra': { parent: 'radio', theme: 'radio' },
  'dmr': { parent: 'radio', theme: 'radio' },
  'mototrbo': { parent: 'radio', theme: 'radio' },
  'dispatching-solutions': { parent: 'radio', theme: 'radio' },
  'project-25-radios': { parent: 'radio', theme: 'radio' },
  // Microwave subcategories
  'ptp-microwave-links': { parent: 'microwave', theme: 'microwave' },
  'ptmp': { parent: 'microwave', theme: 'microwave' },
  'hardware-products': { parent: 'microwave', theme: 'microwave' },
  'software-products': { parent: 'microwave', theme: 'microwave' },
  'point-to-point': { parent: 'microwave', theme: 'microwave' },
  'point-to-multipoint': { parent: 'microwave', theme: 'microwave' },
  'wlan': { parent: 'microwave', theme: 'microwave' },
  'mesh': { parent: 'microwave', theme: 'microwave' },
  // OTN/Fiber subcategories
  'otn-systems': { parent: 'otn-fiber', theme: 'fiber' },
  'sdh-legacy-integration': { parent: 'otn-fiber', theme: 'fiber' },
  'fiber-optic-infrastructure': { parent: 'otn-fiber', theme: 'fiber' },
  'optical-transmission-solutions': { parent: 'otn-fiber', theme: 'fiber' },
}

// Category redirects (if any)
const REDIRECT_CATEGORIES: Record<string, string> = {}

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
    total,
    totalPages: Math.ceil(total / limit),
  }
}

async function getAllProductsIncludingChildren(categorySlug: string) {
  const encodedSlug = encodeURIComponent(categorySlug).toLowerCase()
  // Find the parent category and all its children
  const parentCat = await prisma.category.findUnique({
    where: { slug: encodedSlug },
    include: {
      children: {
        include: {
          children: true, // grandchildren
        },
      },
    },
  })

  if (!parentCat) return { products: [] as Product[], total: 0 }

  // Collect all category IDs (parent + children + grandchildren)
  const categoryIds = [parentCat.id]
  for (const child of parentCat.children) {
    categoryIds.push(child.id)
    for (const grandchild of child.children) {
      categoryIds.push(grandchild.id)
    }
  }

  const [rawProducts, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        status: 'PUBLISHED',
      },
      include: {
        category: { select: { id: true, nameFa: true, nameEn: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true, logo: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({
      where: {
        categoryId: { in: categoryIds },
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
    category: p.category ? { nameFa: p.category.nameFa, slug: p.category.slug } : null,
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug, logo: p.brand.logo } : null,
  }))

  return { products, total }
}

async function getAllProductsByCategory(categorySlug: string) {
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

  return { products: mappedProducts, total }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params

  // Custom metadata for themed categories
  const themedMeta: Record<string, { title: string; description: string }> = {
    'paga': {
      title: 'PAGA & Industrial Intercom Systems | NEUMANN Elektronik | Melisa',
      description: 'Professional PA/GA and industrial intercom systems by NEUMANN Elektronik. EN 54-16 certified public address, general alarm, and IP intercom solutions for oil & gas and critical infrastructure.',
    },
    'cctv': {
      title: 'Industrial CCTV & Video Surveillance Systems | Melisa',
      description: 'Advanced CCTV and video surveillance systems for industrial environments. Pelco, Avigilon, and Axis cameras for oil & gas, power plants, and critical infrastructure.',
    },
    'radar-surveillance-system': {
      title: 'Perimeter Radar Security Systems | Navtech Radar | Melisa',
      description: 'Next-generation radar-based perimeter security systems for critical infrastructure. Authorized Navtech Radar partner in UAE and GCC.',
    },
    'radio': {
      title: 'Mission-Critical Radio Communication Systems | TETRA & DMR | Melisa',
      description: 'TETRA, DMR, and P25 digital radio systems by Motorola Solutions. Enterprise-grade communication for public safety, defense, and industrial operations.',
    },
    'microwave': {
      title: 'Microwave Communication Systems | SIAE Microelettronica | Melisa',
      description: 'High-capacity microwave communication systems for telecom operators and enterprises. Licensed and unlicensed microwave links up to 10 Gbps.',
    },
    'otn-fiber': {
      title: 'OTN & Fiber Optic Communication Networks | Melisa',
      description: 'Cutting-edge OTN/DWDM and fiber optic solutions for telecom operators and enterprise networks. Ultra-high-capacity optical infrastructure.',
    },
  }

  if (themedMeta[cat]) {
    return themedMeta[cat]
  }

  // For subcategories, use parent's meta with subcategory name
  if (SUBCATEGORY_TO_PARENT[cat]) {
    const category = await getCategory(cat)
    if (category) {
      const name = category.nameEn || category.nameFa
      return {
        title: `${name} | Melisa Trading`,
        description: `Browse ${name} products - Professional telecommunications and security solutions by Melisa Trading.`,
      }
    }
  }

  const category = await getCategory(cat)

  if (!category) {
    return { title: 'Category not found' }
  }

  return {
    title: category.nameFa,
    description: category.description || `View products in ${category.nameFa} category`,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { cat } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)

  // Check if this category should redirect
  if (REDIRECT_CATEGORIES[cat]) {
    redirect(REDIRECT_CATEGORIES[cat])
  }

  // Check if this is a themed category or a subcategory of one
  let themedType = THEMED_CATEGORIES[cat]
  let productSlug = cat // which category slug to load products from

  // If not a parent themed category, check if it's a subcategory
  if (!themedType && SUBCATEGORY_TO_PARENT[cat]) {
    themedType = SUBCATEGORY_TO_PARENT[cat].theme
    productSlug = cat // load products from this subcategory, not parent
  }

  if (themedType) {
    // For parent categories: load ALL products (including from subcategories)
    // For subcategories: load only that subcategory's products
    let products: Product[]
    let total: number

    if (THEMED_CATEGORIES[cat]) {
      // Parent category - get products from this cat AND all its subcategories
      const result = await getAllProductsIncludingChildren(cat)
      products = result.products
      total = result.total
    } else {
      // Subcategory - get only this subcategory's products
      const result = await getAllProductsByCategory(productSlug)
      products = result.products
      total = result.total
    }

    // Get subcategory name if this is a subcategory
    let subcategoryName: string | undefined
    if (!THEMED_CATEGORIES[cat] && SUBCATEGORY_TO_PARENT[cat]) {
      const subCat = await getCategory(cat)
      subcategoryName = subCat?.nameEn || subCat?.nameFa || undefined
    }

    switch (themedType) {
      case 'paga':
        return <PAGACategoryPage products={products} totalProducts={total} subcategoryName={subcategoryName} />
      case 'cctv':
        return <CCTVCategoryPage products={products} totalProducts={total} subcategoryName={subcategoryName} />
      case 'radar':
        return <RadarCategoryPage products={products} totalProducts={total} subcategoryName={subcategoryName} />
      case 'radio':
        return <RadioCategoryPage products={products} totalProducts={total} subcategoryName={subcategoryName} />
      case 'microwave':
        return <MicrowaveCategoryPage products={products} totalProducts={total} subcategoryName={subcategoryName} />
      case 'fiber':
        return <FiberCategoryPage products={products} totalProducts={total} subcategoryName={subcategoryName} />
    }
  }

  // Regular category page
  const [category, categories, { products, totalPages }] = await Promise.all([
    getCategory(cat),
    getCategories(),
    getProductsByCategory(cat, currentPage),
  ])

  if (!category) {
    notFound()
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
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
            Browse our complete product catalog
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
                <p className="text-gray-500">No products found in this category</p>
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
