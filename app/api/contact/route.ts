import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const contactSchema = z.object({
  name: z.string().min(2, 'نام الزامی است'),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  subject: z.string().min(3, 'موضوع الزامی است'),
  message: z.string().min(10, 'پیام حداقل باید ۱۰ کاراکتر باشد'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'پیام شما با موفقیت ارسال شد',
        id: contactMessage.id,
      },
      { status: 201 }
    )
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

    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'خطا در ارسال پیام',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}
