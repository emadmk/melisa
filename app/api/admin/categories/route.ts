import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const categorySchema = z.object({
  nameFa: z.string().min(2, 'نام فارسی الزامی است'),
  nameEn: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().nullable().optional(),
  order: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tree = searchParams.get('tree') === 'true'

    if (tree) {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: {
            include: {
              children: true,
              _count: { select: { products: true } },
            },
            orderBy: { order: 'asc' },
          },
          _count: { select: { products: true } },
        },
        orderBy: { order: 'asc' },
      })
      return NextResponse.json({ success: true, data: { categories } })
    }

    const categories = await prisma.category.findMany({
      include: {
        parent: { select: { nameFa: true } },
        _count: { select: { products: true, children: true } },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, data: { categories } })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = categorySchema.parse(body)

    const slug = data.slug || slugify(data.nameFa)

    const category = await prisma.category.create({
      data: {
        nameFa: data.nameFa,
        nameEn: data.nameEn,
        slug,
        description: data.description,
        image: data.image,
        parentId: data.parentId,
        order: data.order || 0,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
      },
    })

    return NextResponse.json({ success: true, message: 'دسته‌بندی ایجاد شد', data: category })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 })
    }
    console.error('Error creating category:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    const data = categorySchema.partial().parse(updateData)

    const category = await prisma.category.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, message: 'بروزرسانی شد', data: category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
