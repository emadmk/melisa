import { Metadata } from 'next'
import Image from 'next/image'
import { Award, ExternalLink } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Certificate {
  id: string
  titleFa: string
  description: string | null
  image: string | null
  issuer: string | null
  issueDate: Date | null
}

function formatYear(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)
}

export const metadata: Metadata = {
  title: 'Certificates & Licenses',
  description: 'Official certificates and licenses of Melisa - Authorized distributor of reputable brands',
}

async function getCertificates(): Promise<Certificate[]> {
  const certificates = await prisma.certificate.findMany({
    orderBy: { order: 'asc' },
  })
  return certificates as Certificate[]
}

export default async function CertificatesPage() {
  const certificates = await getCertificates()

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Certificates', url: '/certificates' },
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
          <h1 className="text-3xl font-bold text-dark text-center">Certificates & Licenses</h1>
          <p className="text-gray-500 text-center mt-3">Official authorizations and operating licenses</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Intro */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12 text-center">
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark mb-3">
            Authorized Distributor of Leading Global Brands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Melisa, as an authorized distributor of reputable global brands, guarantees
            product authenticity and provides standard after-sales services.
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No certificates registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={cert.image || '/images/certificates/default.jpg'}
                    alt={cert.titleFa}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-4 left-4 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-primary" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-primary font-medium">{cert.issuer || ''}</span>
                    <span className="text-xs text-gray-400">{formatYear(cert.issueDate)}</span>
                  </div>
                  <h3 className="font-bold text-dark mb-2">{cert.titleFa}</h3>
                  <p className="text-gray-600 text-sm">{cert.description || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
