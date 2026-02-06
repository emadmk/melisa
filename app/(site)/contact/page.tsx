import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { PageHero } from '@/components/common'
import ContactForm from '@/components/forms/ContactForm'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact Us | Melisa Trading',
  description: 'Contact Melisa - Phone, email and address for telecommunications and security solutions in Dubai, UAE',
}

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: [siteConfig.phone, siteConfig.phone2],
    link: `tel:${siteConfig.phone}`,
    color: 'bg-blue-500',
  },
  {
    icon: Mail,
    title: 'Email',
    details: [siteConfig.email],
    link: `mailto:${siteConfig.email}`,
    color: 'bg-green-500',
  },
  {
    icon: MapPin,
    title: 'Address',
    details: [siteConfig.address],
    link: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`,
    color: 'bg-primary',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: ['Sun - Thu: 9 AM to 6 PM', 'Fri & Sat: Closed'],
    color: 'bg-purple-500',
  },
]

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Contact Us', url: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our team for telecommunications and security solutions"
        breadcrumbItems={breadcrumbItems}
        iconName="MessageSquare"
      />

      {/* Contact Cards */}
      <section className="py-12 sm:py-16 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
                >
                  <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      info.link && idx === 0 ? (
                        <a
                          key={idx}
                          href={info.link}
                          className="block text-slate-600 hover:text-primary transition-colors text-sm"
                          dir={info.title === 'Phone' ? 'ltr' : undefined}
                        >
                          {detail}
                        </a>
                      ) : (
                        <p key={idx} className="text-slate-600 text-sm" dir={info.title === 'Phone' ? 'ltr' : undefined}>
                          {detail}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Send Us a Message</h2>
                  <p className="text-slate-500 text-sm">We&apos;ll get back to you within 24 hours</p>
                </div>
              </div>
              <ContactForm />
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our Location</h2>
                    <p className="text-slate-500 text-sm">Visit us at our Dubai office</p>
                  </div>
                </div>
              </div>
              <div className="relative h-[300px] sm:h-[400px] bg-slate-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.135987877536!2d55.29895831544319!3d25.26197418386847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDeira%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1640000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Melisa Location"
                  className="absolute inset-0"
                />
              </div>
              <div className="p-4 sm:p-6 bg-slate-50">
                <p className="text-slate-600 text-sm">
                  <strong className="text-slate-900">Address:</strong> {siteConfig.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Banner */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                Need Immediate Assistance?
              </h2>
              <p className="text-slate-400">
                Our team is available during business hours to help you
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span dir="ltr">{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-3 px-6 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
