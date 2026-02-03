import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const faq = await prisma.faq.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'سوال یافت نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: faq })
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

    const faq = await prisma.faq.update({
      where: { id },
      data: {
        question: body.question,
        answer: body.answer,
        categoryId: body.categoryId || null,
        status: body.status || 'DRAFT',
        order: body.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: faq })
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
    await prisma.faq.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
