'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqCategory {
  id: string
  nameFa: string
}

export default function NewFaqPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<FaqCategory[]>([])
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')

  const [form, setForm] = useState({
    question: '',
    questionAr: '',
    answer: '',
    answerAr: '',
    categoryId: '',
    status: 'DRAFT',
    order: 0,
  })

  useEffect(() => {
    fetch('/api/admin/faq-categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data.categories || [])
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || null,
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/faqs')
      } else {
        alert(data.message || 'Error saving')
      }
    } catch {
      alert('Error saving')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/faqs"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">New Question</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {/* Language Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'en'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ar')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'ar'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            العربية
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'en' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question (English) *
                </label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer (English) *
                </label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السؤال (العربية)
                </label>
                <input
                  type="text"
                  value={form.questionAr}
                  onChange={(e) => setForm({ ...form, questionAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الجواب (العربية)
                </label>
                <textarea
                  value={form.answerAr}
                  onChange={(e) => setForm({ ...form, answerAr: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameFa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Link
            href="/admin/faqs"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
