import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { generateArticleSchema } from '@/lib/seo'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface Post {
  id: string
  slug: string
  titleFa: string
  titleAr: string | null
  excerpt: string | null
  excerptAr: string | null
  content: string | null
  contentAr: string | null
  image: string | null
  status: string
  publishedAt: Date | null
  updatedAt: Date
  author: string | null
  postCategory: { nameFa: string; nameAr: string | null; slug: string } | null
}

async function getPost(slug: string): Promise<Post | null> {
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  const post = await prisma.post.findUnique({
    where: { slug: encodedSlug },
    include: {
      postCategory: {
        select: { nameFa: true, nameAr: true, slug: true }
      }
    }
  })
  return post as Post | null
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

function formatDateISO(date: Date | null): string {
  if (!date) return new Date().toISOString()
  return date.toISOString()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'المقال غير موجود' }
  }

  const title = post.titleAr || post.titleFa
  const description = post.excerptAr || post.excerpt

  return {
    title,
    description: description || '',
  }
}

export default async function BlogPostPageAr({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post || post.status !== 'PUBLISHED') {
    notFound()
  }

  const title = post.titleAr || post.titleFa
  const excerpt = post.excerptAr || post.excerpt
  const content = post.contentAr || post.content
  const categoryName = post.postCategory?.nameAr || post.postCategory?.nameFa

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/ar' },
    { name: 'المدونة', url: '/ar/blog' },
    { name: title, url: `/ar/blog/${post.slug}` },
  ]

  const articleSchema = generateArticleSchema({
    title,
    description: excerpt || '',
    image: post.image || '/images/blog/default.jpg',
    author: post.author || 'الفريق التقني',
    datePublished: formatDateISO(post.publishedAt),
    dateModified: formatDateISO(post.updatedAt),
    url: `https://melisa.ae/ar/blog/${post.slug}`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              {categoryName && (
                <span className="inline-block bg-primary text-white text-sm px-3 py-1 rounded-full mb-4">
                  {categoryName}
                </span>
              )}

              <h1 className="text-3xl font-bold text-dark mb-4">{title}</h1>

              <div className="flex items-center gap-6 text-gray-500 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author || 'الفريق التقني'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
              </div>
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.image}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content || '' }}
            />

            {/* Back Link */}
            <div className="mt-12 pt-8 border-t">
              <Link
                href="/ar/blog"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                العودة إلى المدونة
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
