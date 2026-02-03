import { Metadata } from 'next'
import { Breadcrumb } from '@/components/common'
import FaqAccordion from '@/components/faq/FaqAccordion'
import { generateFaqSchema, siteConfig } from '@/lib/seo'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'سوالات متداول',
  description: 'پاسخ سوالات رایج درباره تجهیزات مخابراتی، دوربین مداربسته و خدمات کرمان هاتف ارتباط',
  alternates: {
    canonical: `${siteConfig.url}/faq`,
  },
}

interface FAQ {
  id: string
  question: string
  answer: string
}

async function getFaqs(): Promise<FAQ[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        question: true,
        answer: true,
      },
      orderBy: { order: 'asc' },
    })
    return faqs
  } catch {
    return []
  }
}

export default async function FaqPage() {
  const faqs = await getFaqs()

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'سوالات متداول', url: '/faq' },
  ]

  const faqSchema = faqs.length > 0 ? generateFaqSchema(faqs) : null

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-dark text-center">سوالات متداول</h1>
            <p className="text-gray-500 text-center mt-3">پاسخ سوالات رایج</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </div>
    </>
  )
}
