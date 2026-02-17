import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const productSchema = z.object({
  titleFa: z.string().min(2, 'عنوان فارسی الزامی است'),
  titleEn: z.string().nullable().optional(),
  titleAr: z.string().nullable().optional(),
  slug: z.string().optional(),
  shortDesc: z.string().nullable().optional(),
  shortDescAr: z.string().nullable().optional(),
  fullDesc: z.string().nullable().optional(),
  fullDescAr: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  gallery: z.array(z.string()).optional(),
  catalogFile: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
  keywords: z.array(z.string()).optional(),
  categoryId: z.string().nullable().optional(),
  categoryIds: z.array(z.string()).optional(),
  brandId: z.string().nullable().optional(),
  attributes: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
})

// GET - List products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const brandId = searchParams.get('brandId')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { titleFa: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) where.status = status
    if (categoryId) {
      where.OR = [
        ...(where.OR ? (where.OR as Record<string, unknown>[]) : []),
        { categoryId },
        { categories: { some: { id: categoryId } } },
      ]
      // If there was a search OR, combine them with AND
      if (search) {
        where.AND = [
          { OR: [
            { titleFa: { contains: search, mode: 'insensitive' } },
            { titleEn: { contains: search, mode: 'insensitive' } },
          ]},
          { OR: [
            { categoryId },
            { categories: { some: { id: categoryId } } },
          ]},
        ]
        delete where.OR
      }
    }
    if (brandId) where.brandId = brandId

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, nameFa: true, slug: true } },
          categories: { select: { id: true, nameFa: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          _count: { select: { inquiries: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

// POST - Create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = productSchema.parse(body)

    const slug = data.slug || slugify(data.titleFa)

    // Check if slug exists
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'این اسلاگ قبلا استفاده شده' },
        { status: 400 }
      )
    }

    const categoryIds = data.categoryIds || []

    const product = await prisma.product.create({
      data: {
        titleFa: data.titleFa,
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        slug,
        shortDesc: data.shortDesc,
        shortDescAr: data.shortDescAr,
        fullDesc: data.fullDesc,
        fullDescAr: data.fullDescAr,
        image: data.image,
        gallery: data.gallery || [],
        catalogFile: data.catalogFile,
        status: data.status || 'DRAFT',
        featured: data.featured || false,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        keywords: data.keywords || [],
        categoryId: categoryIds[0] || data.categoryId || null,
        categories: categoryIds.length > 0
          ? { connect: categoryIds.map((id: string) => ({ id })) }
          : undefined,
        brandId: data.brandId,
        attributes: data.attributes
          ? {
              create: data.attributes.map((attr, index) => ({
                key: attr.key,
                value: attr.value,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        categories: true,
        brand: true,
        attributes: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت ایجاد شد',
      data: product,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'اطلاعات وارد شده معتبر نیست', errors: error.issues },
        { status: 400 }
      )
    }
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه محصول الزامی است' },
        { status: 400 }
      )
    }

    const data = productSchema.partial().parse(updateData)
    const categoryIds = data.categoryIds

    // Delete existing attributes if new ones provided
    if (data.attributes) {
      await prisma.productAttribute.deleteMany({ where: { productId: id } })
    }

    // Build update data without categoryIds (not a Prisma field)
    const { categoryIds: _catIds, ...prismaData } = data

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...prismaData,
        categoryId: categoryIds ? (categoryIds[0] || null) : prismaData.categoryId,
        categories: categoryIds
          ? { set: categoryIds.map((cid: string) => ({ id: cid })) }
          : undefined,
        attributes: data.attributes
          ? {
              create: data.attributes.map((attr, index) => ({
                key: attr.key,
                value: attr.value,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        categories: true,
        brand: true,
        attributes: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت بروزرسانی شد',
      data: product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه محصول الزامی است' },
        { status: 400 }
      )
    }

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت حذف شد',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
