'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'

const serviceRequestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  serviceType: z.string().optional(),
  message: z.string().optional(),
})

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>

interface ServiceRequestFormProps {
  serviceTitle?: string
  locale?: 'en' | 'ar'
}

const translations = {
  en: {
    successTitle: 'Your request has been submitted successfully',
    successMessage: 'Our experts will contact you as soon as possible',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your name',
    phone: 'Phone Number',
    phonePlaceholder: '09123456789',
    serviceType: 'Service Type',
    setup: 'Setup',
    equipmentSupply: 'Equipment Supply',
    installation: 'Installation',
    engineering: 'Engineering',
    description: 'Description',
    descriptionPlaceholder: 'Write your description or requirements...',
    sending: 'Sending...',
    submit: 'Submit Request',
  },
  ar: {
    successTitle: 'تم إرسال طلبك بنجاح',
    successMessage: 'سيتصل بك خبراؤنا في أقرب وقت ممكن',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخل اسمك',
    phone: 'رقم الهاتف',
    phonePlaceholder: '09123456789',
    serviceType: 'نوع الخدمة',
    setup: 'التشغيل',
    equipmentSupply: 'توريد المعدات',
    installation: 'التركيب',
    engineering: 'الهندسة',
    description: 'الوصف',
    descriptionPlaceholder: 'اكتب وصفك أو متطلباتك...',
    sending: 'جاري الإرسال...',
    submit: 'إرسال الطلب',
  },
}

export default function ServiceRequestForm({ serviceTitle, locale = 'en' }: ServiceRequestFormProps) {
  const t = translations[locale]
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
          subject: `Service request: ${data.serviceType}`,
          message: `Phone: ${data.phone}\n${data.message || ''}`,
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
          {t.successTitle}
        </h3>
        <p className="text-green-600">
          {t.successMessage}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t.fullName}
        placeholder={t.fullNamePlaceholder}
        error={errors.name?.message}
        required
        {...register('name')}
      />

      <Input
        label={t.phone}
        placeholder={t.phonePlaceholder}
        type="tel"
        dir="ltr"
        error={errors.phone?.message}
        required
        {...register('phone')}
      />

      <div>
        <label className="block text-sm font-medium text-dark mb-1.5">
          {t.serviceType}
        </label>
        <select
          className="w-full px-4 py-2.5 text-dark bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          {...register('serviceType')}
        >
          <option value="Setup">{t.setup}</option>
          <option value="Equipment Supply">{t.equipmentSupply}</option>
          <option value="Installation">{t.installation}</option>
          <option value="Engineering">{t.engineering}</option>
        </select>
      </div>

      <Textarea
        label={t.description}
        placeholder={t.descriptionPlaceholder}
        rows={4}
        {...register('message')}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin ml-2" />
            {t.sending}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 ml-2" />
            {t.submit}
          </>
        )}
      </Button>
    </form>
  )
}
