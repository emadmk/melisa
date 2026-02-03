'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Check, Minus, ArrowRight } from 'lucide-react'
import { Breadcrumb } from '@/components/common'

interface CompareProduct {
  id: string
  titleFa: string
  titleEn?: string
  slug: string
  image: string
  category?: string
  brand?: string
  attributes: { key: string; value: string }[]
}

// Get all unique attributes
const getAllAttributes = (products: CompareProduct[]) => {
  const attrs = new Set<string>()
  products.forEach((p) => p.attributes.forEach((a) => attrs.add(a.key)))
  return Array.from(attrs)
}

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<CompareProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load compare products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('compareProducts')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setSelectedProducts(parsed)
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage when products change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('compareProducts', JSON.stringify(selectedProducts))
    }
  }, [selectedProducts, isLoading])

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const allAttributes = getAllAttributes(selectedProducts)

  const getAttributeValue = (product: CompareProduct, key: string) => {
    const attr = product.attributes.find((a) => a.key === key)
    return attr?.value || '-'
  }

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'مقایسه محصولات', url: '/compare' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">در حال بارگذاری...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark text-center">مقایسه محصولات</h1>
          <p className="text-gray-500 text-center mt-2">
            محصولات انتخابی خود را مقایسه کنید
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {selectedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">محصولی انتخاب نشده</h2>
            <p className="text-gray-500 mb-6">
              برای مقایسه، محصولات مورد نظر را از صفحه محصولات انتخاب کنید
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              مشاهده محصولات
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                {/* Products Header */}
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-right font-medium text-gray-500 w-48">
                      محصول
                    </th>
                    {selectedProducts.map((product) => (
                      <th key={product.id} className="p-4 min-w-[200px]">
                        <div className="relative">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                            title="حذف از مقایسه"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <Link href={`/products/${product.slug}`}>
                            <div className="relative w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden mb-3">
                              <Image
                                src={product.image || '/images/products/default.jpg'}
                                alt={product.titleFa}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <h3 className="font-bold text-dark hover:text-primary transition-colors">
                              {product.titleFa}
                            </h3>
                            {product.titleEn && (
                              <p className="text-xs text-gray-400" dir="ltr">
                                {product.titleEn}
                              </p>
                            )}
                          </Link>
                        </div>
                      </th>
                    ))}
                    {selectedProducts.length < 4 && (
                      <th className="p-4 min-w-[200px]">
                        <Link
                          href="/products"
                          className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors"
                        >
                          <Plus className="w-8 h-8" />
                          <span className="text-sm">افزودن</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Basic Info */}
                <tbody className="divide-y">
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">دسته‌بندی</td>
                    {selectedProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        {product.category || '-'}
                      </td>
                    ))}
                    {selectedProducts.length < 4 && <td />}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700">برند</td>
                    {selectedProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        {product.brand || '-'}
                      </td>
                    ))}
                    {selectedProducts.length < 4 && <td />}
                  </tr>

                  {/* Attributes */}
                  {allAttributes.map((attr, index) => (
                    <tr key={attr} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-4 font-medium text-gray-700">{attr}</td>
                      {selectedProducts.map((product) => {
                        const value = getAttributeValue(product, attr)
                        return (
                          <td key={product.id} className="p-4 text-center">
                            {value === 'بله' ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : value === 'خیر' ? (
                              <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              value
                            )}
                          </td>
                        )
                      })}
                      {selectedProducts.length < 4 && <td />}
                    </tr>
                  ))}

                  {/* Actions */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">عملیات</td>
                    {selectedProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <Link
                          href={`/products/${product.slug}#inquiry`}
                          className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
                        >
                          درخواست قیمت
                        </Link>
                      </td>
                    ))}
                    {selectedProducts.length < 4 && <td />}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-2">راهنما</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• برای افزودن محصول به مقایسه، از صفحه محصولات دکمه &quot;افزودن به مقایسه&quot; را کلیک کنید</li>
            <li>• حداکثر ۴ محصول قابل مقایسه است</li>
            <li>• برای حذف محصول از مقایسه، روی دکمه × کلیک کنید</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
