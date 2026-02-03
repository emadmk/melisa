'use client'

import { useState, useEffect, useCallback, FormEvent } from 'react'
import { Plus, Edit, Trash2, GripVertical, ChevronDown, Loader2 } from 'lucide-react'

interface Faq {
  id: string
  question: string
  answer: string
  category: string | null
  order: number
}

export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Form state
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/faqs')
      const data = await res.json()
      if (data.success) {
        setFaqs(data.data.faqs || [])
      }
    } catch (error) {
      console.error('Error fetching faqs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  const openAddModal = () => {
    setEditingFaq(null)
    setQuestion('')
    setAnswer('')
    setCategory('')
    setShowModal(true)
  }

  const openEditModal = (faq: Faq) => {
    setEditingFaq(faq)
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setCategory(faq.category || '')
    setShowModal(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) return

    setSaving(true)
    try {
      const body = { question, answer, category: category || null }
      const url = editingFaq ? `/api/admin/faqs/${editingFaq.id}` : '/api/admin/faqs'
      const method = editingFaq ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (data.success) {
        setShowModal(false)
        fetchFaqs()
      } else {
        alert(data.error || 'خطا در ذخیره')
      }
    } catch (error) {
      console.error('Error saving faq:', error)
      alert('خطا در ذخیره')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این سوال مطمئن هستید؟')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchFaqs()
      } else {
        alert('خطا در حذف')
      }
    } catch (error) {
      console.error('Error deleting faq:', error)
      alert('خطا در حذف')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">سوالات متداول</h1>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          افزودن سوال
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {faqs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            سوالی یافت نشد
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="p-4">
              <div className="flex items-start gap-3">
                <button className="cursor-grab text-gray-400 hover:text-gray-600 mt-1">
                  <GripVertical className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between text-right"
                  >
                    <div>
                      {faq.category && (
                        <span className="text-xs text-primary font-medium">{faq.category}</span>
                      )}
                      <h3 className="font-medium text-dark">{faq.question}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedId === faq.id && (
                    <p className="mt-3 text-gray-600 text-sm">{faq.answer}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                    title="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    disabled={deleting === faq.id}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="حذف"
                  >
                    {deleting === faq.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-dark">
                {editingFaq ? 'ویرایش سوال' : 'افزودن سوال'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  دسته‌بندی
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  <option value="سفارش">سفارش</option>
                  <option value="گارانتی">گارانتی</option>
                  <option value="خدمات">خدمات</option>
                  <option value="پرداخت">پرداخت</option>
                  <option value="عمومی">عمومی</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  سوال *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="سوال را وارد کنید..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  پاسخ *
                </label>
                <textarea
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="پاسخ را وارد کنید..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
