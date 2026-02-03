import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const projectSchema = z.object({
  titleFa: z.string().min(1, 'عنوان فارسی الزامی است'),
  titleEn: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  client: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
})

// GET - List all projects
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

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        projects,
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

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = projectSchema.parse(body)
    const slug = validatedData.slug || slugify(validatedData.titleFa)

    const project = await prisma.project.create({
      data: {
        titleFa: validatedData.titleFa,
        titleEn: validatedData.titleEn || null,
        slug,
        description: validatedData.description || null,
        images: validatedData.images || [],
        client: validatedData.client || null,
        location: validatedData.location || null,
        year: validatedData.year || null,
        status: validatedData.status || 'DRAFT',
        featured: validatedData.featured || false,
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json({ success: true, data: project })
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

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        titleFa: data.titleFa,
        titleEn: data.titleEn,
        slug: data.slug,
        description: data.description,
        images: data.images,
        client: data.client,
        location: data.location,
        year: data.year,
        status: data.status,
        featured: data.featured,
        order: data.order,
      },
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 })
    }

    await prisma.project.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'پروژه حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
