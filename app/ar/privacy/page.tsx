import { Metadata } from 'next'
import { Shield, Mail } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة الخصوصية لشركة ملیسا لتجارة معدات الاتصالات ذ.م.م - كيف نجمع ونستخدم ونحمي بياناتك الشخصية.',
}

const sections = [
  {
    title: 'المعلومات التي نجمعها',
    content:
      'قد نجمع معلومات شخصية مثل اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وتفاصيل شركتك عند تقديم نموذج.',
  },
  {
    title: 'كيف نستخدم معلوماتك',
    content: 'ستُستخدم معلوماتك فقط من أجل:',
    list: [
      'الرد على استفساراتك',
      'تقديم حلول الاتصالات ومقترحات المشاريع',
      'الاتصال التجاري المتعلق بطلبك',
    ],
  },
  {
    title: 'مشاركة البيانات',
    content:
      'نحن لا نبيع أو نؤجر أو نشارك بياناتك الشخصية مع أطراف ثالثة.',
  },
  {
    title: 'أمان البيانات',
    content:
      'نتخذ التدابير المناسبة لحماية معلوماتك من الوصول غير المصرح به.',
  },
]

export default function PrivacyPolicyPageAr() {
  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'سياسة الخصوصية', url: '/ar/privacy' },
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
          <h1 className="text-3xl font-bold text-dark text-center">
            سياسة الخصوصية
          </h1>
          <p className="text-gray-500 text-center mt-3">
            كيف نجمع ونستخدم ونحمي بياناتك الشخصية
          </p>
        </div>
      </div>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Intro */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-8">
              <div className="flex items-center gap-3 mb-6 flex-row-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-slate-900">
                    شركة {siteConfig.nameAr} لتجارة معدات الاتصالات ذ.م.م
                  </h2>
                  <p className="text-sm text-slate-500">
                    تحترم خصوصيتك وتلتزم بحماية بياناتك الشخصية.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={index} className="text-right">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      {section.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                    {section.list && (
                      <ul className="mt-3 space-y-2">
                        {section.list.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-slate-600 flex-row-reverse"
                          >
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">
                أسئلة حول الخصوصية؟
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                لأي أسئلة تتعلق بالخصوصية، يرجى التواصل معنا على:
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <Mail className="w-4 h-4" />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
