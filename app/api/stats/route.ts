import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      productsCount,
      categoriesCount,
      brandsCount,
      servicesCount,
      postsCount,
      projectsCount,
      inquiriesCount,
      pendingInquiriesCount,
    ] = await Promise.all([
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.service.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.project.count({ where: { status: 'PUBLISHED' } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'PENDING' } }),
    ])

    // Get recent inquiries
    const recentInquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        productTitle: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          products: productsCount,
          categories: categoriesCount,
          brands: brandsCount,
          services: servicesCount,
          posts: postsCount,
          projects: projectsCount,
          inquiries: inquiriesCount,
          pendingInquiries: pendingInquiriesCount,
        },
        recentInquiries,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
