import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Test products - with PUBLISHED status
    const productsPublished = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, slug: true, status: true },
      take: 5,
    })

    // Test products - without filter
    const productsAll = await prisma.product.findMany({
      select: { id: true, slug: true, status: true },
      take: 5,
    })

    // Test brands
    const brands = await prisma.brand.findMany({
      select: { id: true, slug: true },
      take: 5,
    })

    // Test categories
    const categories = await prisma.category.findMany({
      select: { id: true, slug: true },
      take: 5,
    })

    return NextResponse.json({
      productsWithPublishedStatus: productsPublished,
      productsWithoutFilter: productsAll,
      brands,
      categories,
      counts: {
        productsPublished: productsPublished.length,
        productsAll: productsAll.length,
        brands: brands.length,
        categories: categories.length,
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Database error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
