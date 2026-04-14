import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Clock, Tag, ChevronRight, Home, BookOpen } from 'lucide-react'
import { generateArticleSchema } from '@/lib/seo'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface RelatedPost {
  id: string
  titleFa: string
  slug: string
  excerpt: string | null
  image: string | null
  publishedAt: Date | null
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

async function getRelatedPosts(categoryId: string | null, currentId: string): Promise<RelatedPost[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: currentId },
      ...(categoryId ? { postCategoryId: categoryId } : {}),
    },
    select: {
      id: true,
      titleFa: true,
      slug: true,
      excerpt: true,
      image: true,
      publishedAt: true,
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })
  return posts as RelatedPost[]
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

function formatDateISO(date: Date | null): string {
  if (!date) return new Date().toISOString()
  return date.toISOString()
}

function calculateReadTime(content: string | null): string {
  if (!content) return '1 min read'
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Article not found' }
  }

  return {
    title: `${post.titleFa} | Melisa Blog`,
    description: post.excerpt || '',
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post || post.status !== 'PUBLISHED') {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.postCategoryId, post.id)
  const readTime = calculateReadTime(post.content)

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
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden pt-32 sm:pt-36">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 pb-4 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <Link href="/blog" className="text-slate-400 hover:text-primary transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">{post.titleFa}</span>
            </nav>

            {/* Article Header */}
            <div className="py-8 sm:py-12 max-w-4xl">
              {post.postCategory && (
                <Link
                  href={`/blog/category/${post.postCategory.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-full mb-6 hover:bg-primary-dark transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  {post.postCategory.nameFa}
                </Link>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.titleFa}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-300">
                <span className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  {post.author || 'Technical Team'}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  {readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.image && (
              <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12 shadow-2xl -mt-16 sm:-mt-24">
                <Image
                  src={post.image}
                  alt={post.titleEn || post.titleFa}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={post.image.includes('/uploads/')}
                />
              </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
              <div
                className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-a:text-primary prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />
            </div>

            {/* Back Link */}
            <div className="mt-8 flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 sm:py-16 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <BookOpen className="w-4 h-4" />
                  Related Articles
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">You Might Also Like</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {relatedPosts.map((relPost) => (
                  <Link
                    key={relPost.id}
                    href={`/blog/${relPost.slug}`}
                    className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={relPost.image || '/images/blog/default.jpg'}
                        alt={relPost.titleFa}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={!!relPost.image?.includes('/uploads/')}
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-slate-400 text-sm mb-2">{formatDate(relPost.publishedAt)}</p>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                        {relPost.titleFa}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Need Expert Advice?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Our team is here to help with your telecommunications and security needs
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
