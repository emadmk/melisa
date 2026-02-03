import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const catalogSchema = z.object({
  titleFa: z.string().min(1, 'عنوان فارسی الزامی است'),
  titleEn: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  file: z.string().min(1, 'فایل الزامی است'),
  thumbnail: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  order: z.number().optional(),
})

// GET - List all catalogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { titleFa: { contains: search, mode: 'insensitive' as const } },
            { titleEn: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [catalogs, total] = await Promise.all([
      prisma.catalog.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.catalog.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        catalogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

// POST - Create new catalog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = catalogSchema.parse(body)
    const slug = validatedData.slug || slugify(validatedData.titleFa)

    const catalog = await prisma.catalog.create({
      data: {
        titleFa: validatedData.titleFa,
        titleEn: validatedData.titleEn || null,
        slug,
        description: validatedData.description || null,
        file: validatedData.file,
        thumbnail: validatedData.thumbnail || null,
        categoryId: validatedData.categoryId || null,
        status: validatedData.status || 'DRAFT',
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: catalog })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0]?.message || 'خطای اعتبارسنجی' },
        { status: 400 }
      )
    }
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

// PUT - Update catalog
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    const catalog = await prisma.catalog.update({
      where: { id },
      data: {
        titleFa: data.titleFa,
        titleEn: data.titleEn,
        slug: data.slug,
        description: data.description,
        file: data.file,
        thumbnail: data.thumbnail,
        categoryId: data.categoryId,
        status: data.status,
        order: data.order,
      },
    })

    return NextResponse.json({ success: true, data: catalog })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

// DELETE - Delete catalog
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    await prisma.catalog.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'کاتالوگ حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
