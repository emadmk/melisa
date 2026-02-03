import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Database has URL-encoded slugs, Next.js auto-decodes params, so re-encode
    const encodedSlug = encodeURIComponent(slug).toLowerCase()

    const post = await prisma.post.findUnique({
      where: { slug: encodedSlug },
    })

    if (!post || post.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get related posts
    const relatedPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: post.id },
      },
      select: { id: true, title: true, slug: true, image: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })

    return NextResponse.json({
      success: true,
      data: { post, relatedPosts },
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
