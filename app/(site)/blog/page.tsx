import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, FileText } from 'lucide-react'
import { PageHero, Pagination } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Post {
  id: string
  slug: string
  titleFa: string
  image: string | null
  excerpt: string | null
  author: string | null
  publishedAt: Date | null
  postCategory: { nameFa: string; slug: string } | null
}

export const metadata: Metadata = {
  title: 'Blog | Melisa Trading',
  description: 'Latest articles and news in the field of telecommunications and security equipment',
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

async function getPosts(page: number = 1, limit: number = 9) {
  try {
    const skip = (page - 1) * limit

    const [rawPosts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          titleFa: true,
          image: true,
          excerpt: true,
          author: true,
          publishedAt: true,
          postCategoryId: true,
        },
      }).catch(() => []),
      prisma.post.count({ where: { status: 'PUBLISHED' } }).catch(() => 0),
    ])

    // Fetch categories defensively
    const posts: Post[] = []
    for (const p of rawPosts) {
      let postCategory: { nameFa: string; slug: string } | null = null
      if (p.postCategoryId) {
        try {
          const cat = await prisma.postCategory.findUnique({
            where: { id: p.postCategoryId },
            select: { nameFa: true, slug: true },
          })
          postCategory = cat
        } catch {
          postCategory = null
        }
      }
      posts.push({
        id: p.id,
        slug: p.slug,
        titleFa: p.titleFa,
        image: p.image,
        excerpt: p.excerpt,
        author: p.author,
        publishedAt: p.publishedAt,
        postCategory,
      })
    }

    return { posts, total, totalPages: Math.ceil(total / limit) }
  } catch (e) {
    console.error('Error loading posts:', e)
    return { posts: [] as Post[], total: 0, totalPages: 0 }
  }
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const { posts, total, totalPages } = await getPosts(currentPage)

  const breadcrumbItems = [
    { name: 'Blog', url: '/blog' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Our Blog"
        subtitle={`Stay updated with ${total}+ articles on telecommunications, security, and industry insights`}
        breadcrumbItems={breadcrumbItems}
        iconName="Newspaper"
      />

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-500">Check back later for new articles.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={post.image || '/images/blog/default.jpg'}
                      alt={post.titleFa}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={!!post.image?.includes('/uploads/')}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    {post.postCategory && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        {post.postCategory.nameFa}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author || 'Technical Team'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.titleFa}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/blog" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
