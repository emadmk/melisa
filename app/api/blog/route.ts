import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          postCategory: {
            select: { nameFa: true, slug: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
    ])

    // Transform posts to use 'title' field (prefer English, fallback to Farsi)
    const transformedPosts = posts.map((post: typeof posts[number]) => ({
      ...post,
      title: post.titleEn || post.titleFa,
      postCategory: post.postCategory ? {
        name: post.postCategory.nameFa,
        slug: post.postCategory.slug,
      } : null,
    }))

    return NextResponse.json({
      success: true,
      data: {
        posts: transformedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
