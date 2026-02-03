import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()
    const type = searchParams.get('type') || 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: {
          products: [],
          posts: [],
          services: [],
          categories: [],
        },
        total: 0,
      })
    }

    const results: {
      products: unknown[]
      posts: unknown[]
      services: unknown[]
      categories: unknown[]
    } = {
      products: [],
      posts: [],
      services: [],
      categories: [],
    }

    // Search products
    if (type === 'all' || type === 'products') {
      results.products = await prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { titleFa: { contains: query, mode: 'insensitive' } },
            { titleEn: { contains: query, mode: 'insensitive' } },
            { shortDesc: { contains: query, mode: 'insensitive' } },
            { keywords: { has: query } },
          ],
        },
        select: {
          id: true,
          titleFa: true,
          titleEn: true,
          slug: true,
          image: true,
          shortDesc: true,
          category: {
            select: { nameFa: true, slug: true },
          },
          brand: {
            select: { name: true, slug: true },
          },
        },
        take: limit,
        orderBy: { viewCount: 'desc' },
      })
    }

    // Search posts
    if (type === 'all' || type === 'posts') {
      results.posts = await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { titleFa: { contains: query, mode: 'insensitive' } },
            { titleEn: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
        },
        select: {
          id: true,
          titleFa: true,
          slug: true,
          image: true,
          excerpt: true,
          publishedAt: true,
        },
        take: limit,
        orderBy: { publishedAt: 'desc' },
      })
    }

    // Search services
    if (type === 'all' || type === 'services') {
      results.services = await prisma.service.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { titleFa: { contains: query, mode: 'insensitive' } },
            { titleEn: { contains: query, mode: 'insensitive' } },
            { shortDesc: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          titleFa: true,
          slug: true,
          icon: true,
          shortDesc: true,
        },
        take: limit,
      })
    }

    // Search categories
    if (type === 'all' || type === 'categories') {
      results.categories = await prisma.category.findMany({
        where: {
          OR: [
            { nameFa: { contains: query, mode: 'insensitive' } },
            { nameEn: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          nameFa: true,
          slug: true,
          image: true,
          _count: {
            select: { products: true },
          },
        },
        take: limit,
      })
    }

    const total =
      results.products.length +
      results.posts.length +
      results.services.length +
      results.categories.length

    return NextResponse.json({
      success: true,
      query,
      results,
      total,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'خطا در جستجو',
      },
      { status: 500 }
    )
  }
}
