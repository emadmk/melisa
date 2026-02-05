'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  nameFa: string
}

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')

  const [form, setForm] = useState({
    nameFa: '',
    nameEn: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    image: '',
    parentId: '',
    order: 0,
    metaTitle: '',
    metaTitleAr: '',
    metaDesc: '',
    metaDescAr: '',
  })

  useEffect(() => {
    fetch('/api/admin/categories')
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
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image: form.image || null,
          parentId: form.parentId || null,
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/categories')
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
          href="/admin/categories"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">New Category</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === 'en' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Name *
                </label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  dir="ltr"
                  placeholder="Leave empty to generate automatically"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم (العربية)
                </label>
                <input
                  type="text"
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف (العربية)
                </label>
                <textarea
                  value={form.descriptionAr}
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>
            </>
          )}

          {/* Common fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              value={form.parentId}
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">No parent (main category)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameFa}
                </option>
              ))}
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

          <div className="md:col-span-2">
            <ImageUpload
              value={form.image || null}
              onChange={(url) => setForm({ ...form, image: url || '' })}
              folder="categories"
              label="Image"
            />
          </div>

          {/* SEO Section */}
          <div className="md:col-span-2 border-t pt-6 mt-4">
            <h3 className="font-bold text-dark mb-4">SEO Settings</h3>

            {/* SEO Language Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === 'en' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title (English)
                    </label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description (English)
                    </label>
                    <input
                      type="text"
                      value={form.metaDesc}
                      onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الميتا (العربية)
                    </label>
                    <input
                      type="text"
                      value={form.metaTitleAr}
                      onChange={(e) => setForm({ ...form, metaTitleAr: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الميتا (العربية)
                    </label>
                    <input
                      type="text"
                      value={form.metaDescAr}
                      onChange={(e) => setForm({ ...form, metaDescAr: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                      dir="rtl"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Link
            href="/admin/categories"
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
