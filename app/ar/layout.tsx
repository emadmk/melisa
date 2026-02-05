import type { Metadata } from 'next'
import '../globals.css'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import { Header, Footer } from '@/components/layout'
import { WhatsAppButton, BackToTop } from '@/components/common'
import { generateOrganizationSchema, generateLocalBusinessSchema, generateWebSiteSchema, siteConfig } from '@/lib/seo'
import { GoogleAnalytics } from '@/components/common'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'ميليسا | حلول الاتصالات والأمن',
    template: '%s | ميليسا',
  },
  description: 'ميليسا هي شركة اتصالات متخصصة في مشاريع الاتصالات والراديو وكاميرات المراقبة وأنظمة النداء في دبي، الإمارات.',
  keywords: [
    'معدات الاتصالات',
    'كاميرات المراقبة',
    'أنظمة الأمن',
    'موتورولا',
    'أفيجيلون',
    'كامبيوم نتوركس',
    'أنظمة التحكم',
    'أنظمة النداء',
    'الاتصالات اللاسلكية',
    'دبي',
    'الإمارات',
  ],
  alternates: {
    canonical: `${siteConfig.url}/ar`,
    languages: {
      'en': siteConfig.url,
      'ar': `${siteConfig.url}/ar`,
      'x-default': siteConfig.url,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_AE',
    alternateLocale: 'en_AE',
    url: `${siteConfig.url}/ar`,
    siteName: 'ميليسا',
    title: 'ميليسا | حلول الاتصالات والأمن',
    description: 'ميليسا هي شركة اتصالات متخصصة في مشاريع الاتصالات والراديو وكاميرات المراقبة وأنظمة النداء.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'ميليسا',
      },
    ],
  },
}

export default async function ArabicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dictionary = await getDictionary('ar')
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* hreflang tags for SEO */}
        <link rel="alternate" hrefLang="en" href={siteConfig.url} />
        <link rel="alternate" hrefLang="ar" href={`${siteConfig.url}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-gray-50 text-dark"
        style={{ fontFamily: "'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif" }}
      >
        <GoogleAnalytics />
        <LocaleProvider locale="ar" dictionary={dictionary}>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
          <WhatsAppButton />
          <BackToTop />
        </LocaleProvider>
      </body>
    </html>
  )
}
