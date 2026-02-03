import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const catalog = await prisma.catalog.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!catalog) {
      return NextResponse.json(
        { success: false, message: 'کاتالوگ یافت نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: catalog })
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

    const catalog = await prisma.catalog.update({
      where: { id },
      data: {
        titleFa: body.titleFa,
        titleEn: body.titleEn || null,
        slug: body.slug,
        description: body.description || null,
        file: body.file,
        thumbnail: body.thumbnail || null,
        categoryId: body.categoryId || null,
        status: body.status || 'DRAFT',
        order: body.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: catalog })
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
    await prisma.catalog.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
