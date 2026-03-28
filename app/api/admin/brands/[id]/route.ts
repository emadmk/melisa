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

    // Only update fields that are actually sent in the request
    const data: Record<string, unknown> = {}
    if ('name' in body) data.name = body.name
    if ('nameAr' in body) data.nameAr = body.nameAr || null
    if ('slug' in body) data.slug = body.slug
    if ('logo' in body) data.logo = body.logo || null
    if ('description' in body) data.description = body.description || null
    if ('descriptionAr' in body) data.descriptionAr = body.descriptionAr || null
    if ('website' in body) data.website = body.website || null
    if ('featured' in body) data.featured = body.featured || false
    if ('order' in body) data.order = body.order || 0

    const brand = await prisma.brand.update({
      where: { id },
      data,
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
