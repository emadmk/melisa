import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.faqCategory.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ success: true, data: { categories } })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const category = await prisma.faqCategory.create({
      data: {
        nameFa: body.nameFa,
        nameEn: body.nameEn || null,
        slug: body.slug,
        order: body.order || 0,
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
