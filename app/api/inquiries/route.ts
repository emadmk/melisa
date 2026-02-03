import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const inquirySchema = z.object({
  name: z.string().min(2, 'نام الزامی است'),
  company: z.string().optional(),
  phone: z.string().min(10, 'شماره تلفن معتبر نیست'),
  email: z.string().email('ایمیل معتبر نیست'),
  message: z.string().optional(),
  productId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = inquirySchema.parse(body)

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        message: data.message,
        productId: data.productId || null,
        status: 'NEW',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'درخواست شما با موفقیت ثبت شد',
      id: inquiry.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'اطلاعات وارد شده معتبر نیست',
          errors: error.issues.map((e) => e.message),
        },
        { status: 400 }
      )
    }

    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = status ? { status: status as 'NEW' | 'REVIEWED' | 'ANSWERED' | 'CLOSED' } : {}

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          product: {
            select: { titleFa: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
