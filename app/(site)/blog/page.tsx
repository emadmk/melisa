import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Breadcrumb, Pagination } from '@/components/common'
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
  title: 'وبلاگ',
  description: 'مقالات و اخبار کرمان هاتف ارتباط در زمینه تجهیزات مخابراتی و امنیتی',
}

async function getPosts(page: number = 1, limit: number = 9) {
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      include: {
        postCategory: {
          select: { nameFa: true, slug: true }
        }
      }
    }),
    prisma.post.count({
      where: { status: 'PUBLISHED' }
    })
  ])

  return { posts: posts as Post[], total, totalPages: Math.ceil(total / limit) }
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

export default async function BlogPage() {
  const { posts, totalPages } = await getPosts()

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'وبلاگ', url: '/blog' },
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
          <h1 className="text-3xl font-bold text-dark text-center">وبلاگ</h1>
          <p className="text-gray-500 text-center mt-3">آخرین مقالات و اخبار</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">در حال حاضر مقاله‌ای ثبت نشده است</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={post.image || '/images/blog/default.jpg'}
                      alt={post.titleFa}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.postCategory && (
                      <span className="absolute top-4 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                        {post.postCategory.nameFa}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-lg font-bold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.titleFa}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt || ''}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author || 'تیم فنی'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                      ادامه مطلب
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination currentPage={1} totalPages={totalPages} baseUrl="/blog" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
