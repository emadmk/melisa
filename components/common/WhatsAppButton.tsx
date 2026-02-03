'use client'

import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/lib/seo'
import { trackWhatsAppClick } from '@/lib/analytics'

export default function WhatsAppButton() {
  const handleClick = () => {
    trackWhatsAppClick('floating_button')
    window.open(
      `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`,
      '_blank'
    )
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 animate-float"
      aria-label="تماس با واتساپ"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}
