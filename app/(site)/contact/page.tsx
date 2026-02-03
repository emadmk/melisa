import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import ContactForm from '@/components/forms/ContactForm'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'تماس با ما',
  description: 'راه‌های ارتباطی با کرمان هاتف ارتباط - تلفن، ایمیل و آدرس',
}

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'تماس با ما', url: '/contact' },
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
          <h1 className="text-3xl font-bold text-dark text-center">تماس با ما</h1>
          <p className="text-gray-500 text-center mt-3">
            برای ارتباط با ما از طریق راه‌های زیر اقدام کنید
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold text-dark mb-6">اطلاعات تماس</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">تلفن تماس</h3>
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
                  <h3 className="font-medium text-dark mb-1">ایمیل</h3>
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
                  <h3 className="font-medium text-dark mb-1">آدرس</h3>
                  <p className="text-gray-600">{siteConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">ساعات کاری</h3>
                  <p className="text-gray-600">شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر</p>
                  <p className="text-gray-600">پنجشنبه: ۹ صبح تا ۱ ظهر</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <span className="text-gray-500">نقشه گوگل</span>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold text-dark mb-6">فرم تماس</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
