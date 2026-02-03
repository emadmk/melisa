import { Metadata } from 'next'

export const siteConfig = {
  name: 'Melisa',
  nameAr: 'ملیسا',
  description: 'Melisa is a telecommunications company specializing in telecommunications, radio, CCTV, and paging projects. With advanced technology, the company provides high-quality and secure communication and information exchange services.',
  descriptionAr: 'شركة ملیسا للاتصالات متخصصة في مشاريع الاتصالات والراديو والدوائر التلفزيونية المغلقة وأنظمة النداء',
  url: 'https://melisa.ae',
  phone: '(971) 527664837',
  phone2: '(971) 42438653 Ext. 202',
  whatsapp: '+971527664837',
  email: 'info@melisa.ae',
  address: 'Office No. 02, Unit 2202, 22nd Floor, Metropolis Tower, Al Abraj Street, Business Bay, Dubai, United Arab Emirates',
  experience: '15',
  instagram: 'https://instagram.com/melisa.ae',
  linkedin: 'https://linkedin.com/company/melisa-ae',
  twitter: '',
}

export function generateSeoMeta({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
}: {
  title: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`
  const desc = description || siteConfig.description
  const imageUrl = image || '/images/og-default.jpg'

  return {
    title: fullTitle,
    description: desc,
    keywords: keywords?.join(', '),
    authors: [{ name: siteConfig.name }],
    openGraph: {
      title: fullTitle,
      description: desc,
      url: url || siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_AE',
      type: type as 'website' | 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  brand?: string
  category?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    category: product.category,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'AED',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
    },
    url: product.url,
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    alternateName: siteConfig.nameAr,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    sameAs: [
      siteConfig.instagram,
      siteConfig.linkedin,
    ].filter(Boolean),
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    image: `${siteConfig.url}/images/logo.png`,
    '@id': siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '18:00',
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  image: string
  author: string
  datePublished: string
  dateModified: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: siteConfig.nameAr,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'en-AE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
  }
}

export function generateCollectionPageSchema(items: {
  name: string
  description?: string
  url: string
  image?: string
}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Products',
    description: 'Melisa telecommunications and security products',
    url: `${siteConfig.url}/products`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.description,
        url: item.url,
        image: item.image,
      })),
    },
  }
}
