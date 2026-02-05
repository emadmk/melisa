import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const serviceSchema = z.object({
  titleFa: z.string().min(2),
  titleEn: z.string().optional(),
  titleAr: z.string().optional(),
  slug: z.string().optional(),
  shortDesc: z.string().optional(),
  shortDescAr: z.string().optional(),
  fullDesc: z.string().optional(),
  fullDescAr: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  order: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
})

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ success: true, data: { services } })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = serviceSchema.parse(body)
    const slug = data.slug || slugify(data.titleFa)

    const service = await prisma.service.create({ data: { ...data, slug } })
    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 })
    }
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) return NextResponse.json({ success: false, message: 'شناسه الزامی' }, { status: 400 })

    const service = await prisma.service.update({ where: { id }, data: updateData })
    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ success: false, message: 'شناسه الزامی' }, { status: 400 })

    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
