'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Printer className="w-4 h-4" />
      Print
    </button>
  )
}
