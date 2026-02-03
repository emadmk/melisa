import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { year: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: { certificates },
    })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
