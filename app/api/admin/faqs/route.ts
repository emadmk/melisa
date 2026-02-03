import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const faqSchema = z.object({
  question: z.string().min(1, 'سوال الزامی است'),
  answer: z.string().min(1, 'پاسخ الزامی است'),
  categoryId: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  order: z.number().optional(),
})

// GET - List all FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { question: { contains: search, mode: 'insensitive' as const } },
            { answer: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [faqs, total] = await Promise.all([
      prisma.faq.findMany({
        where,
        include: { category: true },
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.faq.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        faqs,
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

// POST - Create new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = faqSchema.parse(body)

    const faq = await prisma.faq.create({
      data: {
        question: validatedData.question,
        answer: validatedData.answer,
        categoryId: validatedData.categoryId,
        status: validatedData.status || 'DRAFT',
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: faq })
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

// PUT - Update FAQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    const faq = await prisma.faq.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        categoryId: data.categoryId,
        status: data.status,
        order: data.order,
      },
    })

    return NextResponse.json({ success: true, data: faq })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

// DELETE - Delete FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    await prisma.faq.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'سوال حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
