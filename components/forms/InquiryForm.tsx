'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'
import { trackInquirySubmit } from '@/lib/analytics'

const inquirySchema = z.object({
  name: z.string().min(2, 'نام و نام خانوادگی الزامی است'),
  company: z.string().optional(),
  phone: z.string().min(10, 'شماره تماس معتبر وارد کنید'),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  message: z.string().optional(),
})

type InquiryFormData = z.infer<typeof inquirySchema>

interface InquiryFormProps {
  productId?: string
  productTitle?: string
}

export default function InquiryForm({ productId, productTitle }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  })

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          productId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        trackInquirySubmit(productTitle)
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        console.error('Error:', result.message)
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-green-800 mb-2">
          درخواست شما با موفقیت ثبت شد
        </h3>
        <p className="text-green-600">
          کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="نام و نام خانوادگی"
          placeholder="نام خود را وارد کنید"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <Input
          label="شرکت / سازمان"
          placeholder="نام شرکت (اختیاری)"
          {...register('company')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="شماره تماس"
          placeholder="09123456789"
          type="tel"
          dir="ltr"
          error={errors.phone?.message}
          required
          {...register('phone')}
        />

        <Input
          label="ایمیل"
          placeholder="email@example.com"
          type="email"
          dir="ltr"
          error={errors.email?.message}
          required
          {...register('email')}
        />
      </div>

      <Textarea
        label="توضیحات"
        placeholder="توضیحات یا سوالات خود را بنویسید..."
        rows={4}
        {...register('message')}
      />

      {productId && (
        <input type="hidden" name="productId" value={productId} />
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin ml-2" />
            در حال ارسال...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 ml-2" />
            ارسال درخواست
          </>
        )}
      </Button>
    </form>
  )
}
