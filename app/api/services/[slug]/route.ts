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

    const service = await prisma.service.findUnique({
      where: { slug: encodedSlug },
    })

    if (!service || service.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    // Get other services for sidebar
    const otherServices = await prisma.service.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: service.id },
      },
      select: { id: true, title: true, slug: true, icon: true },
      orderBy: { order: 'asc' },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      data: { service, otherServices },
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
