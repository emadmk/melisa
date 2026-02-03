import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postCategory: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'مطلب یافت نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: post })
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

    const post = await prisma.post.update({
      where: { id },
      data: {
        titleFa: body.titleFa,
        titleEn: body.titleEn || null,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content || null,
        image: body.image || null,
        status: body.status || 'DRAFT',
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        author: body.author || null,
        postCategoryId: body.postCategoryId || null,
        tags: body.tags || [],
        metaTitle: body.metaTitle || null,
        metaDesc: body.metaDesc || null,
      },
    })

    return NextResponse.json({ success: true, data: post })
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
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'حذف شد' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
