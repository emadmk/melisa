import { Metadata } from 'next'
import Link from 'next/link'
import { FileDown, FileText } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Catalog {
  id: string
  title: string
  description: string | null
  category: string | null
  fileUrl: string | null
  fileSize: string | null
}

export const metadata: Metadata = {
  title: 'کاتالوگ محصولات',
  description: 'دانلود کاتالوگ محصولات کرمان هاتف ارتباط - تجهیزات مخابراتی، دوربین مداربسته، کنترل دسترسی',
}

async function getCatalogs(): Promise<Catalog[]> {
  const catalogs = await prisma.catalog.findMany({
    orderBy: { order: 'asc' },
  })
  return catalogs as Catalog[]
}

export default async function CatalogPage() {
  const catalogs = await getCatalogs()

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'کاتالوگ', url: '/catalog' },
  ]

  // Get unique categories for filter buttons
  const categories = ['همه', ...Array.from(new Set(catalogs.map(c => c.category).filter((c): c is string => c !== null)))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-dark text-center">کاتالوگ محصولات</h1>
          <p className="text-gray-500 text-center mt-3">دانلود کاتالوگ و بروشور محصولات</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === 'همه'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Catalogs Grid */}
        {catalogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">در حال حاضر کاتالوگی ثبت نشده است</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogs.map((catalog) => (
              <div
                key={catalog.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-primary font-medium">{catalog.category || 'عمومی'}</span>
                    <h3 className="font-bold text-dark mt-1 mb-2">{catalog.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{catalog.description || ''}</p>
                    <span className="text-xs text-gray-400">حجم فایل: {catalog.fileSize || '-'}</span>
                  </div>
                </div>

                <Link
                  href={catalog.fileUrl || '#'}
                  className="flex items-center justify-center gap-2 w-full mt-4 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  <FileDown className="w-5 h-5" />
                  دانلود کاتالوگ
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-dark mb-3">
            به کاتالوگ خاصی نیاز دارید؟
          </h2>
          <p className="text-gray-600 mb-6">
            در صورت نیاز به کاتالوگ محصول خاصی با ما تماس بگیرید
          </p>
          <Link
            href="/contact"
            className="inline-block bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            تماس با ما
          </Link>
        </div>
      </div>
    </div>
  )
}
