import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

type ProductWhereInput = {
  status?: string
  category?: { slug: string }
  brand?: { slug: string }
  OR?: Array<{
    titleFa?: { contains: string; mode: 'insensitive' }
    titleEn?: { contains: string; mode: 'insensitive' }
    shortDesc?: { contains: string; mode: 'insensitive' }
  }>
}

type ProductOrderByInput = {
  createdAt?: 'asc' | 'desc'
  titleFa?: 'asc' | 'desc'
}

// Validation schema for product query
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  category: z.string().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title']).default('newest'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params - only include non-null values
    const rawParams: Record<string, string> = {}
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')

    if (page) rawParams.page = page
    if (limit) rawParams.limit = limit
    if (category) rawParams.category = category
    if (brand) rawParams.brand = brand
    if (search) rawParams.search = search
    if (sort) rawParams.sort = sort

    const query = querySchema.parse(rawParams)

    // Build where clause
    const where: ProductWhereInput = {
      status: 'PUBLISHED',
    }

    if (query.category) {
      where.category = { slug: query.category }
    }

    if (query.brand) {
      where.brand = { slug: query.brand }
    }

    if (query.search) {
      where.OR = [
        { titleFa: { contains: query.search, mode: 'insensitive' } },
        { titleEn: { contains: query.search, mode: 'insensitive' } },
        { shortDesc: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // Build orderBy
    let orderBy: ProductOrderByInput = { createdAt: 'desc' }
    switch (query.sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'title':
        orderBy = { titleFa: 'asc' }
        break
    }

    // Execute queries
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, nameFa: true, nameEn: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true, logo: true } },
        },
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / query.limit)

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages,
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
