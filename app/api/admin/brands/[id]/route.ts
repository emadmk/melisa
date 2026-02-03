import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await prisma.brand.findUnique({
      where: { id },
    })

    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'برند یافت نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: brand })
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

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        logo: body.logo || null,
        description: body.description || null,
        website: body.website || null,
        featured: body.featured || false,
        order: body.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: brand })
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
    await prisma.brand.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
