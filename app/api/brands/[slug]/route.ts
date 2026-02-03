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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)

    const brand = await prisma.brand.findUnique({
      where: { slug: encodedSlug },
    })

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      )
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          brandId: brand.id,
          status: 'PUBLISHED',
        },
        include: {
          category: { select: { id: true, nameFa: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({
        where: {
          brandId: brand.id,
          status: 'PUBLISHED',
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        brand,
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
