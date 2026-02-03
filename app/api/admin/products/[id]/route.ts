import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, nameFa: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'محصول یافت نشد' },
        { status: 404 }
      )
    }

    // Parse attributes from JSON if stored as string
    let attributes: { key: string; value: string }[] = []
    if (product.attributes) {
      try {
        const parsed = typeof product.attributes === 'string'
          ? JSON.parse(product.attributes)
          : product.attributes
        if (Array.isArray(parsed)) {
          attributes = parsed
        }
      } catch {
        // Invalid JSON, ignore
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        attributes,
      },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت حذف شد',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
