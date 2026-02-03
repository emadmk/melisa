'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'
import { trackInquirySubmit } from '@/lib/analytics'

const inquirySchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  company: z.string().optional(),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
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
          Your request has been submitted successfully
        </h3>
        <p className="text-green-600">
          Our experts will contact you as soon as possible
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <Input
          label="Company / Organization"
          placeholder="Company name (optional)"
          {...register('company')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          placeholder="09123456789"
          type="tel"
          dir="ltr"
          error={errors.phone?.message}
          required
          {...register('phone')}
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
      </div>

      <Textarea
        label="Description"
        placeholder="Write your description or questions..."
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
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 ml-2" />
            Submit Request
          </>
        )}
      </Button>
    </form>
  )
}
