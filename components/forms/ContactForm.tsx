'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'
import { trackContactFormSubmit } from '@/lib/analytics'

const contactSchema = z.object({
  name: z.string().min(2, 'نام الزامی است'),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  subject: z.string().min(3, 'موضوع الزامی است'),
  message: z.string().min(10, 'پیام حداقل باید ۱۰ کاراکتر باشد'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        trackContactFormSubmit()
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        console.error('Error:', result.message)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-green-800 mb-2">پیام شما ارسال شد</h3>
        <p className="text-green-600">به زودی با شما تماس خواهیم گرفت</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="نام"
        placeholder="نام خود را وارد کنید"
        error={errors.name?.message}
        required
        {...register('name')}
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

      <Input
        label="موضوع"
        placeholder="موضوع پیام"
        error={errors.subject?.message}
        required
        {...register('subject')}
      />

      <Textarea
        label="پیام"
        placeholder="پیام خود را بنویسید..."
        rows={5}
        error={errors.message?.message}
        required
        {...register('message')}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin ml-2" />در حال ارسال...</>
        ) : (
          <><Send className="w-4 h-4 ml-2" />ارسال پیام</>
        )}
      </Button>
    </form>
  )
}
