'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'
import { cn } from '@/lib/utils'

export default function NewBrandPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')

  const [form, setForm] = useState({
    name: '',
    slug: '',
    logo: '',
    description: '',
    descriptionAr: '',
    website: '',
    featured: false,
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          logo: form.logo || null,
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/brands')
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
          href="/admin/brands"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">New Brand</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              dir="ltr"
              placeholder="https://"
            />
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

          {/* Description with Language Tabs */}
          <div className="md:col-span-2">
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

            {activeTab === 'en' ? (
              <div>
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
            ) : (
              <div>
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
            )}
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              value={form.logo || null}
              onChange={(url) => setForm({ ...form, logo: url || '' })}
              folder="brands"
              label="Logo"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Featured Brand</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Link
            href="/admin/brands"
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
