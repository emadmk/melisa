import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Breadcrumb } from '@/components/common'
import { generateArticleSchema } from '@/lib/seo'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
  const encodedSlug = encodeURIComponent(slug).toLowerCase()
  return prisma.post.findUnique({
    where: { slug: encodedSlug },
    include: {
      postCategory: {
        select: { nameFa: true, slug: true }
      }
    }
  })
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

function formatDateISO(date: Date | null): string {
  if (!date) return new Date().toISOString()
  return date.toISOString()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Article not found' }
  }

  return {
    title: post.titleFa,
    description: post.excerpt || '',
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post || post.status !== 'PUBLISHED') {
    notFound()
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.titleFa, url: `/blog/${post.slug}` },
  ]

  const articleSchema = generateArticleSchema({
    title: post.titleFa,
    description: post.excerpt || '',
    image: post.image || '/images/blog/default.jpg',
    author: post.author || 'Technical Team',
    datePublished: formatDateISO(post.publishedAt),
    dateModified: formatDateISO(post.updatedAt),
    url: `https://melisa.ae/blog/${post.slug}`,
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
              {post.postCategory && (
                <span className="inline-block bg-primary text-white text-sm px-3 py-1 rounded-full mb-4">
                  {post.postCategory.nameFa}
                </span>
              )}

              <h1 className="text-3xl font-bold text-dark mb-4">{post.titleFa}</h1>

              <div className="flex items-center gap-6 text-gray-500 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author || 'Technical Team'}
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
                  alt={post.titleFa}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Back Link */}
            <div className="mt-12 pt-8 border-t">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
