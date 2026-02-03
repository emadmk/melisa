import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const certificateSchema = z.object({
  titleFa: z.string().min(1, 'عنوان فارسی الزامی است'),
  titleEn: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  issuer: z.string().nullable().optional(),
  issueDate: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  order: z.number().optional(),
})

// GET - List all certificates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { titleFa: { contains: search, mode: 'insensitive' as const } },
            { titleEn: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.certificate.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        certificates,
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

// POST - Create new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = certificateSchema.parse(body)
    const slug = validatedData.slug || slugify(validatedData.titleFa)

    const certificate = await prisma.certificate.create({
      data: {
        titleFa: validatedData.titleFa,
        titleEn: validatedData.titleEn || null,
        slug,
        description: validatedData.description || null,
        image: validatedData.image || null,
        issuer: validatedData.issuer || null,
        issueDate: validatedData.issueDate ? new Date(validatedData.issueDate) : null,
        status: validatedData.status || 'DRAFT',
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: certificate })
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

// PUT - Update certificate
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        titleFa: data.titleFa,
        titleEn: data.titleEn,
        slug: data.slug,
        description: data.description,
        image: data.image,
        issuer: data.issuer,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        status: data.status,
        order: data.order,
      },
    })

    return NextResponse.json({ success: true, data: certificate })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

// DELETE - Delete certificate
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    await prisma.certificate.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'گواهینامه حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
