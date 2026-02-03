import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const certificate = await prisma.certificate.findUnique({
      where: { id },
    })

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: 'گواهینامه یافت نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: certificate })
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

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        titleFa: body.titleFa,
        titleEn: body.titleEn || null,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
        issuer: body.issuer || null,
        issueDate: body.issueDate ? new Date(body.issueDate) : null,
        status: body.status || 'DRAFT',
        order: body.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: certificate })
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
    await prisma.certificate.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
