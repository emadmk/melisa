import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateInquirySchema = z.object({
  id: z.string().min(1, 'شناسه الزامی است'),
  status: z.enum(['NEW', 'REVIEWED', 'ANSWERED', 'CLOSED']).optional(),
  notes: z.string().optional(),
})

// GET - List all inquiries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    const where: Record<string, unknown> = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: { product: { select: { id: true, titleFa: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ])

    // Get status counts
    const statusCountsRaw = await prisma.inquiry.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    const statusCounts: Record<string, number> = {}
    for (const item of statusCountsRaw) {
      statusCounts[item.status] = item._count.status
    }

    return NextResponse.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        statusCounts,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

// PUT - Update inquiry status/notes
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateInquirySchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (validatedData.status) updateData.status = validatedData.status
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes

    const inquiry = await prisma.inquiry.update({
      where: { id: validatedData.id },
      data: updateData,
      include: { product: { select: { id: true, titleFa: true, slug: true } } },
    })

    return NextResponse.json({ success: true, data: inquiry })
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

// DELETE - Delete inquiry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    await prisma.inquiry.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'درخواست حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
