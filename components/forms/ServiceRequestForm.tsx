'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'

const serviceRequestSchema = z.object({
  name: z.string().min(2, 'نام الزامی است'),
  phone: z.string().min(10, 'شماره تماس معتبر وارد کنید'),
  serviceType: z.string().optional(),
  message: z.string().optional(),
})

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>

interface ServiceRequestFormProps {
  serviceTitle?: string
}

export default function ServiceRequestForm({ serviceTitle }: ServiceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceType: serviceTitle,
    },
  })

  const onSubmit = async (data: ServiceRequestFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: `${data.phone}@service.local`,
          subject: `درخواست خدمت: ${data.serviceType}`,
          message: `تلفن: ${data.phone}\n${data.message || ''}`,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting request:', error)
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
      <Input
        label="نام و نام خانوادگی"
        placeholder="نام خود را وارد کنید"
        error={errors.name?.message}
        required
        {...register('name')}
      />

      <Input
        label="شماره تماس"
        placeholder="09123456789"
        type="tel"
        dir="ltr"
        error={errors.phone?.message}
        required
        {...register('phone')}
      />

      <div>
        <label className="block text-sm font-medium text-dark mb-1.5">
          نوع خدمت
        </label>
        <select
          className="w-full px-4 py-2.5 text-dark bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          {...register('serviceType')}
        >
          <option value="راه اندازی">راه اندازی</option>
          <option value="تامین تجهیزات">تامین تجهیزات</option>
          <option value="نصب">نصب</option>
          <option value="مهندسی">مهندسی</option>
        </select>
      </div>

      <Textarea
        label="توضیحات"
        placeholder="توضیحات یا نیازمندی‌های خود را بنویسید..."
        rows={4}
        {...register('message')}
      />

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
