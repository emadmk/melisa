import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import ContactForm from '@/components/forms/ContactForm'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'اتصل بنا',
  description: 'تواصل مع ميليسا - الهاتف والبريد الإلكتروني والعنوان',
}

export default function ContactPageAr() {
  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'اتصل بنا', url: '/ar/contact' },
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
          <h1 className="text-3xl font-bold text-dark text-center">اتصل بنا</h1>
          <p className="text-gray-500 text-center mt-3">
            تواصل معنا من خلال القنوات التالية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="order-2 lg:order-1">
            <h2 className="text-xl font-bold text-dark mb-6">معلومات الاتصال</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">الهاتف</h3>
                  <a href={`tel:${siteConfig.phone}`} className="text-gray-600 hover:text-primary" dir="ltr">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">البريد الإلكتروني</h3>
                  <a href={`mailto:${siteConfig.email}`} className="text-gray-600 hover:text-primary">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">العنوان</h3>
                  <p className="text-gray-600">{siteConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">ساعات العمل</h3>
                  <p className="text-gray-600">الأحد إلى الخميس: 9 صباحاً إلى 6 مساءً</p>
                  <p className="text-gray-600">الجمعة والسبت: مغلق</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <span className="text-gray-500">خريطة جوجل</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="order-1 lg:order-2">
            <h2 className="text-xl font-bold text-dark mb-6">نموذج الاتصال</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <ContactForm locale="ar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
