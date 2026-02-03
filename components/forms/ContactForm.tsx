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
        <h3 className="text-lg font-bold text-green-800 mb-2">Your message has been sent</h3>
        <p className="text-green-600">We will contact you soon</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Enter your name"
        error={errors.name?.message}
        required
        {...register('name')}
      />

      <Input
        label="Email"
        placeholder="email@example.com"
        type="email"
        dir="ltr"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <Input
        label="Subject"
        placeholder="Message subject"
        error={errors.subject?.message}
        required
        {...register('subject')}
      />

      <Textarea
        label="Message"
        placeholder="Write your message..."
        rows={5}
        error={errors.message?.message}
        required
        {...register('message')}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin ml-2" />Sending...</>
        ) : (
          <><Send className="w-4 h-4 ml-2" />Send Message</>
        )}
      </Button>
    </form>
  )
}
