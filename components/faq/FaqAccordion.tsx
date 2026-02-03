'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQ {
  id: string
  question: string
  answer: string
}

interface FaqAccordionProps {
  faqs: FAQ[]
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No questions have been submitted</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={faq.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-right"
          >
            <span className="font-medium text-dark">{faq.question}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-gray-400 transition-transform',
                openIndex === index && 'rotate-180'
              )}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 pb-6 text-gray-600 border-t pt-4">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
