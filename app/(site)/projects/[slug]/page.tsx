import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Building2, Calendar, ArrowLeft, CheckCircle } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  return prisma.project.findUnique({
    where: { slug: encodedSlug },
  })
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit' }).format(date)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return { title: 'پروژه یافت نشد' }
  }

  return {
    title: project.title,
    description: project.description || '',
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project || project.status !== 'PUBLISHED') {
    notFound()
  }

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'پروژه‌ها', url: '/projects' },
    { name: project.title, url: `/projects/${project.slug}` },
  ]

  // Parse images and features from JSON fields if they exist
  const images: string[] = project.images ? (typeof project.images === 'string' ? JSON.parse(project.images) : project.images) : [project.image || '/images/projects/default.jpg']
  const features: string[] = project.features ? (typeof project.features === 'string' ? JSON.parse(project.features) : project.features) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
              <Image
                src={images[0] || '/images/projects/default.jpg'}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${project.title} - تصویر ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-2xl font-bold text-dark mb-4">{project.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
                {project.client && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-primary" />
                    {project.client}
                  </span>
                )}
                {project.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {project.location}
                  </span>
                )}
                {project.completedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDate(project.completedAt)}
                  </span>
                )}
              </div>

              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: project.fullDescription || project.description || '' }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">اطلاعات پروژه</h2>

              <div className="space-y-3">
                {project.client && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">کارفرما:</span>
                    <span className="text-dark font-medium">{project.client}</span>
                  </div>
                )}
                {project.location && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">موقعیت:</span>
                    <span className="text-dark font-medium">{project.location}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">دسته‌بندی:</span>
                    <span className="text-dark font-medium">{project.category}</span>
                  </div>
                )}
                {project.completedAt && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">تاریخ اتمام:</span>
                    <span className="text-dark font-medium">{formatDate(project.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-dark mb-4">ویژگی‌های پروژه</h2>

                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-primary rounded-xl p-6 text-white text-center">
              <h3 className="font-bold text-lg mb-2">پروژه مشابه نیاز دارید؟</h3>
              <p className="text-sm opacity-90 mb-4">
                با کارشناسان ما مشورت کنید
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                تماس با ما
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
