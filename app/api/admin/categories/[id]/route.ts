import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'دسته‌بندی یافت نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const category = await prisma.category.update({
      where: { id },
      data: {
        nameFa: body.nameFa,
        nameEn: body.nameEn || null,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
        parentId: body.parentId || null,
        order: body.order || 0,
        metaTitle: body.metaTitle || null,
        metaDesc: body.metaDesc || null,
      },
    })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
