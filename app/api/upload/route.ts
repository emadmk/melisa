import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function generateFileName(originalName: string): string {
  const ext = path.extname(originalName)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}${ext}`
}

function getUploadPath(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `uploads/${year}/${month}`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'فایلی انتخاب نشده' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'نوع فایل مجاز نیست. فرمت‌های مجاز: JPG, PNG, WebP, GIF, PDF',
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: 'حجم فایل بیش از ۱۰ مگابایت است',
        },
        { status: 400 }
      )
    }

    // Determine upload directory
    const uploadPath = folder || getUploadPath()
    const uploadDir = path.join(process.cwd(), 'public', uploadPath)

    // Create directory if not exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const fileName = generateFileName(file.name)
    const filePath = path.join(uploadDir, fileName)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return public URL
    const url = `/${uploadPath}/${fileName}`

    return NextResponse.json({
      success: true,
      message: 'فایل با موفقیت آپلود شد',
      file: {
        name: fileName,
        originalName: file.name,
        url,
        size: file.size,
        type: file.type,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'خطا در آپلود فایل',
      },
      { status: 500 }
    )
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string | null

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'فایلی انتخاب نشده' },
        { status: 400 }
      )
    }

    const uploadPath = folder || getUploadPath()
    const uploadDir = path.join(process.cwd(), 'public', uploadPath)

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validate
      if (!ALLOWED_TYPES.includes(file.type)) continue
      if (file.size > MAX_SIZE) continue

      const fileName = generateFileName(file.name)
      const filePath = path.join(uploadDir, fileName)

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      uploadedFiles.push({
        name: fileName,
        originalName: file.name,
        url: `/${uploadPath}/${fileName}`,
        size: file.size,
        type: file.type,
      })
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} فایل آپلود شد`,
      files: uploadedFiles,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'خطا در آپلود فایل‌ها',
      },
      { status: 500 }
    )
  }
}
