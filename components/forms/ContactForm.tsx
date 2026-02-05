'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'
import { trackContactFormSubmit } from '@/lib/analytics'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  locale?: 'en' | 'ar'
}

const translations = {
  en: {
    successTitle: 'Your message has been sent',
    successMessage: 'We will contact you soon',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    email: 'Email',
    emailPlaceholder: 'email@example.com',
    subject: 'Subject',
    subjectPlaceholder: 'Message subject',
    message: 'Message',
    messagePlaceholder: 'Write your message...',
    sending: 'Sending...',
    send: 'Send Message',
  },
  ar: {
    successTitle: 'تم إرسال رسالتك',
    successMessage: 'سنتواصل معك قريباً',
    name: 'الاسم',
    namePlaceholder: 'أدخل اسمك',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'email@example.com',
    subject: 'الموضوع',
    subjectPlaceholder: 'موضوع الرسالة',
    message: 'الرسالة',
    messagePlaceholder: 'اكتب رسالتك...',
    sending: 'جاري الإرسال...',
    send: 'إرسال الرسالة',
  },
}

export default function ContactForm({ locale = 'en' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const t = translations[locale]

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
        <h3 className="text-lg font-bold text-green-800 mb-2">{t.successTitle}</h3>
        <p className="text-green-600">{t.successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t.name}
        placeholder={t.namePlaceholder}
        error={errors.name?.message}
        required
        {...register('name')}
      />

      <Input
        label={t.email}
        placeholder={t.emailPlaceholder}
        type="email"
        dir="ltr"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <Input
        label={t.subject}
        placeholder={t.subjectPlaceholder}
        error={errors.subject?.message}
        required
        {...register('subject')}
      />

      <Textarea
        label={t.message}
        placeholder={t.messagePlaceholder}
        rows={5}
        error={errors.message?.message}
        required
        {...register('message')}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin ml-2" />{t.sending}</>
        ) : (
          <><Send className="w-4 h-4 ml-2" />{t.send}</>
        )}
      </Button>
    </form>
  )
}
