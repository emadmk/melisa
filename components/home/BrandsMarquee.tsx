'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
}

export default function BrandsMarquee() {
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setBrands(data.data)
        }
      })
      .catch(console.error)
  }, [])

  if (brands.length === 0) {
    return null
  }

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands]

  return (
    <section className="bg-white py-8 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-gray-500 text-sm font-medium">نمایندگی رسمی برندها</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee">
          {duplicatedBrands.map((brand, index) => (
            <Link
              key={`${brand.slug}-${index}`}
              href={`/brands/${brand.slug}`}
              className="flex-shrink-0 mx-8 lg:mx-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <div className="relative w-32 h-16">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{brand.name}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
