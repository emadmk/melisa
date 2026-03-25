import { Metadata } from 'next'
import { Shield, Mail } from 'lucide-react'
import { PageHero } from '@/components/common'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy | Melisa Trading',
  description: 'Privacy Policy of Melisa Telecommunications Equipment Trading L.L.C - How we collect, use, and protect your personal data.',
}

const sections = [
  {
    title: 'Information We Collect',
    content:
      'We may collect personal information such as your name, email address, phone number, and company details when you submit a form.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information will be used solely for:',
    list: [
      'Responding to your inquiries',
      'Providing communication solutions and project proposals',
      'Business communication related to your request',
    ],
  },
  {
    title: 'Data Sharing',
    content:
      'We do not sell, rent, or share your personal data with third parties.',
  },
  {
    title: 'Data Security',
    content:
      'We take appropriate measures to protect your information from unauthorized access.',
  },
]

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ name: 'Privacy Policy', url: '/privacy' }]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal data"
        breadcrumbItems={breadcrumbItems}
        iconName="Shield"
      />

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Intro */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {siteConfig.name} Telecommunications Equipment Trading L.L.C
                  </h2>
                  <p className="text-sm text-slate-500">
                    Respects your privacy and is committed to protecting your
                    personal data.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={index}>
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
                            className="flex items-start gap-2 text-slate-600"
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
                Privacy Questions?
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                For any privacy-related questions, please contact us at:
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
