import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const brandSchema = z.object({
  name: z.string().min(2, 'نام الزامی است'),
  slug: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
})

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ success: true, data: { brands } })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = brandSchema.parse(body)
    const slug = data.slug || slugify(data.name)

    const brand = await prisma.brand.create({
      data: { ...data, slug },
    })

    return NextResponse.json({ success: true, data: brand })
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

    const brand = await prisma.brand.update({ where: { id }, data: updateData })
    return NextResponse.json({ success: true, data: brand })
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

    await prisma.brand.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 })
  }
}
