import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, localeDirections, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import { generateOrganizationSchema, generateLocalBusinessSchema, generateWebSiteSchema, siteConfig } from '@/lib/seo'
import { GoogleAnalytics } from '@/components/common'

interface Props {
  children: React.ReactNode
  params: { locale: Locale }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const isArabic = locale === 'ar'

  const baseUrl = siteConfig.url
  const currentUrl = isArabic ? `${baseUrl}/ar` : baseUrl

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: isArabic
        ? `ميليسا | حلول الاتصالات والأمن`
        : `${siteConfig.name} | Telecommunications & Security Solutions`,
      template: `%s | ${isArabic ? 'ميليسا' : siteConfig.name}`,
    },
    description: isArabic
      ? 'ميليسا هي شركة اتصالات متخصصة في مشاريع الاتصالات والراديو وكاميرات المراقبة وأنظمة النداء في دبي، الإمارات.'
      : siteConfig.description,
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': baseUrl,
        'ar': `${baseUrl}/ar`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      type: 'website',
      locale: isArabic ? 'ar_AE' : 'en_AE',
      alternateLocale: isArabic ? 'en_AE' : 'ar_AE',
      url: currentUrl,
      siteName: isArabic ? 'ميليسا' : siteConfig.name,
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params

  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)
  const dir = localeDirections[locale]
  const isRtl = dir === 'rtl'

  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html lang={locale} dir={dir}>
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
        style={{
          fontFamily: isRtl
            ? "'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif"
            : "'Inter', system-ui, sans-serif"
        }}
      >
        <GoogleAnalytics />
        <LocaleProvider locale={locale} dictionary={dictionary}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
