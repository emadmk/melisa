'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../../components/ImageUpload'
import SeoAnalyzer from '@/components/admin/SeoAnalyzer'

const iconOptions = [
  'Camera', 'Radio', 'Shield', 'Headphones', 'Network',
  'Volume2', 'Settings', 'Truck', 'Wrench', 'Cpu'
]

export default function EditServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    titleFa: '',
    titleEn: '',
    titleAr: '',
    slug: '',
    shortDesc: '',
    shortDescAr: '',
    fullDesc: '',
    fullDescAr: '',
    icon: '',
    image: '',
    status: 'DRAFT',
    order: 0,
    metaTitle: '',
    metaDesc: '',
    focusKeyword: '',
  })

  const fetchService = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`)
      const data = await res.json()

      if (data.success && data.data) {
        const service = data.data
        setFormData({
          titleFa: service.titleFa || '',
          titleEn: service.titleEn || '',
          titleAr: service.titleAr || '',
          slug: service.slug || '',
          shortDesc: service.shortDesc || '',
          shortDescAr: service.shortDescAr || '',
          fullDesc: service.fullDesc || '',
          fullDescAr: service.fullDescAr || '',
          icon: service.icon || '',
          image: service.image || '',
          status: service.status || 'DRAFT',
          order: service.order || 0,
          metaTitle: service.metaTitle || '',
          metaDesc: service.metaDesc || '',
          focusKeyword: service.focusKeyword || '',
        })
      }
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    fetchService()
  }, [fetchService])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: serviceId,
          ...formData,
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert('Service saved successfully')
        router.push('/admin/services')
      } else {
        alert(data.message || 'Error saving service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service')
    } finally {
      setSaving(false)
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
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/services"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">Edit Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Main Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Title (Persian) *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.titleFa}
                      onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Title (English)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Title (Arabic)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.titleAr}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description (English)
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.shortDesc}
                      onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description (Arabic)
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.shortDescAr}
                      onChange={(e) => setFormData({ ...formData, shortDescAr: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description (English)
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.fullDesc}
                      onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description (Arabic)
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.fullDescAr}
                      onChange={(e) => setFormData({ ...formData, fullDescAr: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Publishing</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Icon</h2>

              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                <option value="">Select Icon</option>
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Image</h2>
              <ImageUpload
                value={formData.image || null}
                onChange={(url) => setFormData({ ...formData, image: url || '' })}
                folder="services"
                label="Service Image"
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                    <span className={`mr-2 text-xs ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                      ({formData.metaTitle.length}/60)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                    <span className={`mr-2 text-xs ${formData.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      ({formData.metaDesc.length}/160)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.metaDesc}
                    onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* SEO Analyzer */}
            <SeoAnalyzer
              title={formData.titleFa}
              metaTitle={formData.metaTitle}
              metaDesc={formData.metaDesc}
              content={formData.fullDesc}
              slug={formData.slug}
              focusKeyword={formData.focusKeyword}
              onFocusKeywordChange={(keyword) => setFormData({ ...formData, focusKeyword: keyword })}
              baseUrl="https://hatefertebat.ir/services"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
