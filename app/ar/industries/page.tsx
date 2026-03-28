import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Factory } from 'lucide-react'
import { Breadcrumb } from '@/components/common'

export const metadata: Metadata = {
  title: 'الصناعات التي نخدمها | ميليسا للتجارة',
  description: 'توفر ميليسا للتجارة حلول الاتصالات والأمن وأنظمة PAGA وCCTV للمصافي والمصانع البتروكيماوية والمنصات البحرية والمطارات والمزيد.',
}

const industries = [
  {
    title: 'المصافي',
    description: 'أنظمة اتصالات وسلامة متقدمة لعمليات تكرير النفط، تضمن اتصالاً موثوقاً في البيئات الخطرة.',
    gradient: 'from-orange-600 to-red-700',
    image: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'المصانع البتروكيماوية',
    description: 'حلول PAGA والراديو وكاميرات المراقبة المقاومة للانفجار المصممة لمنشآت المعالجة البتروكيماوية.',
    gradient: 'from-amber-600 to-orange-700',
    image: 'https://images.pexels.com/photos/5884386/pexels-photo-5884386.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'المنصات البحرية',
    description: 'أنظمة اتصالات وإنذار طوارئ بحرية لعمليات النفط والغاز البحرية.',
    gradient: 'from-cyan-600 to-blue-700',
    image: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'صناعات الحديد والصلب',
    description: 'بنية تحتية متينة للاتصالات مصممة لتحمل الحرارة الشديدة والبيئات الصناعية الثقيلة.',
    gradient: 'from-slate-600 to-slate-800',
    image: 'https://images.pexels.com/photos/8973680/pexels-photo-8973680.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'المطارات والنقل والبنية التحتية',
    description: 'أنظمة أمن ومراقبة ونداء عام متكاملة للمطارات ومراكز النقل.',
    gradient: 'from-sky-600 to-indigo-700',
    image: 'https://images.pexels.com/photos/28603501/pexels-photo-28603501.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'مزارع الخزانات',
    description: 'حلول اتصالات ومراقبة متخصصة للمناطق الخطرة في منشآت تخزين الوقود.',
    gradient: 'from-emerald-600 to-teal-700',
    image: 'https://images.pexels.com/photos/9407367/pexels-photo-9407367.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'محطات الطاقة والكهرباء',
    description: 'أنظمة اتصالات متوافقة مع SCADA لمنشآت توليد وتوزيع الطاقة.',
    gradient: 'from-yellow-500 to-amber-600',
    image: 'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'المرافق والبنية التحتية العامة',
    description: 'شبكات اتصالات ذكية لمعالجة المياه وإدارة النفايات والخدمات البلدية.',
    gradient: 'from-violet-600 to-purple-700',
    image: 'https://images.pexels.com/photos/10274179/pexels-photo-10274179.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'المنازل الذكية',
    description: 'أنظمة أتمتة منزلية حديثة وكاميرات أمنية وتحكم بالدخول وأنظمة اتصال داخلي للمشاريع السكنية.',
    gradient: 'from-rose-500 to-pink-600',
    image: 'https://images.pexels.com/photos/18186205/pexels-photo-18186205.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
]

export default function IndustriesPageAr() {
  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'الصناعات', url: '/ar/industries' },
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Red Accent Line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} variant="dark" />
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
              <Factory className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              الصناعات التي نخدمها
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              نقدم حلول اتصالات وأمن وسلامة عالمية المستوى عبر مختلف القطاعات الصناعية
            </p>
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
      </section>

      {/* Industries Grid */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-transparent hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-52 sm:h-56 overflow-hidden">
                <Image
                  src={industry.image}
                  alt={industry.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
                  <span className="text-white text-sm font-bold">{(index + 1).toString().padStart(2, '0')}</span>
                </div>

                {/* Title on image */}
                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-white text-lg font-bold drop-shadow-lg">
                    {industry.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {industry.description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  <span>اقرأ المزيد</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom accent line */}
              <div className={`h-1 bg-gradient-to-r ${industry.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right`} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            هل تحتاج حلاً لصناعتك؟
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            تواصل مع خبرائنا لمناقشة حلول الاتصالات والأمن المخصصة لمتطلبات صناعتك
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ar/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              تواصل معنا
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/ar/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              عرض الحلول
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
