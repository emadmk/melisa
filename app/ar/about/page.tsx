import { Metadata } from 'next'
import Image from 'next/image'
import { Award, Users, Building, Calendar } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { siteConfig } from '@/lib/seo'
import prisma from '@/lib/db'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
}

async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
      },
      orderBy: { name: 'asc' },
    })
    return brands
  } catch {
    return []
  }
}

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على ميليسا - أكثر من 15 عاماً من الخبرة في معدات الاتصالات والأمن في دبي، الإمارات',
}

const stats = [
  { icon: Calendar, label: 'سنوات الخبرة', value: '+15' },
  { icon: Building, label: 'مشروع ناجح', value: '+500' },
  { icon: Users, label: 'عميل راضٍ', value: '+300' },
  { icon: Award, label: 'علامات تجارية موثوقة', value: '5' },
]

export default async function AboutPageAr() {
  const brands = await getBrands()

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'من نحن', url: '/ar/about' },
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
          <h1 className="text-3xl font-bold text-dark text-center">من نحن</h1>
          <p className="text-gray-500 text-center mt-3">تعرف أكثر على {siteConfig.name}</p>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl font-bold text-dark mb-6">عن ميليسا</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              الاتصال هو عملية يتم فيها نقل المعلومات من المصدر إلى الوجهة.
              تتخصص شركة الاتصالات هذه في مشاريع الاتصالات والراديو وكاميرات المراقبة والنداء.
              بتقنية متقدمة، تقدم الشركة خدمات اتصالات وتبادل معلومات عالية الجودة وآمنة لعملائها.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              تمتلك الشركة القدرة على تصميم وتنفيذ وتركيب مشاريع اتصالات وراديو معقدة ومتقدمة.
              كما تستثمر باستمرار في البحث والتطوير للتقنيات الجديدة في الصناعة.
              بالإضافة إلى ذلك، تعمل الشركة في مجال كاميرات المراقبة ويمكنها تقديم خدمات الأمن والمراقبة باستخدام معدات CCTV الحديثة.
            </p>
            <p className="text-gray-600 leading-relaxed">
              في مجال النداء، تقدم خدمات الاتصال والمراسلة.
              بخبرة تقنية قوية وتجربة واسعة، أقامت الشركة تواصلاً فعالاً ومستداماً مع عملائها وحققت التميز في صناعة الاتصالات.
            </p>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-us-img.webp"
                alt="ميليسا للاتصالات"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold">+15</div>
              <div className="text-sm opacity-90">سنوات الخبرة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-dark mb-1">{stat.value}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-dark text-center mb-8">شركاؤنا من العلامات التجارية</h2>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {brands.map((brand) => (
              brand.logo && (
                <div key={brand.id} className="relative w-32 h-20 grayscale hover:grayscale-0 transition-all">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
