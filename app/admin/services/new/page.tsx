'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'
import SeoAnalyzer from '@/components/admin/SeoAnalyzer'
import { cn } from '@/lib/utils'

const iconOptions = [
  'Camera', 'Radio', 'Shield', 'Headphones', 'Network',
  'Volume2', 'Settings', 'Truck', 'Wrench', 'Cpu'
]

export default function NewServicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')
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
    metaTitleAr: '',
    metaDesc: '',
    metaDescAr: '',
    focusKeyword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Use titleEn as titleFa if titleFa is empty
      const submitData = {
        ...formData,
        titleFa: formData.titleFa || formData.titleEn,
      }

      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data = await res.json()

      if (data.success) {
        alert('Service created successfully')
        router.push('/admin/services')
      } else {
        alert(data.message || 'Error creating service')
      }
    } catch (error) {
      console.error('Error creating service:', error)
      alert('Error creating service')
    } finally {
      setSaving(false)
    }
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
        <h1 className="text-2xl font-bold text-dark">Add New Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Main Information</h2>

              {/* Language Tabs */}
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

              <div className="space-y-4">
                {activeTab === 'en' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Title (English) *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      />
                    </div>

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
                        Full Description (English)
                      </label>
                      <textarea
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.fullDesc}
                        onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        عنوان الخدمة (العربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                        value={formData.titleAr}
                        onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        وصف قصير (العربية)
                      </label>
                      <textarea
                        rows={2}
                        dir="rtl"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                        value={formData.shortDescAr}
                        onChange={(e) => setFormData({ ...formData, shortDescAr: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الوصف الكامل (العربية)
                      </label>
                      <textarea
                        rows={6}
                        dir="rtl"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                        value={formData.fullDescAr}
                        onChange={(e) => setFormData({ ...formData, fullDescAr: e.target.value })}
                      />
                    </div>
                  </>
                )}

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
                    placeholder="Leave empty for auto-generation"
                  />
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
                  Save Service
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

              <div className="space-y-4">
                {activeTab === 'en' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Title (English)
                        <span className={`ml-2 text-xs ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
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
                        Meta Description (English)
                        <span className={`ml-2 text-xs ${formData.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
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
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        عنوان الميتا (العربية)
                        <span className={`ml-2 text-xs ${formData.metaTitleAr.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                          ({formData.metaTitleAr.length}/60)
                        </span>
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                        value={formData.metaTitleAr}
                        onChange={(e) => setFormData({ ...formData, metaTitleAr: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        وصف الميتا (العربية)
                        <span className={`ml-2 text-xs ${formData.metaDescAr.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                          ({formData.metaDescAr.length}/160)
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                        value={formData.metaDescAr}
                        onChange={(e) => setFormData({ ...formData, metaDescAr: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SEO Analyzer */}
            <SeoAnalyzer
              title={formData.titleEn}
              metaTitle={formData.metaTitle}
              metaDesc={formData.metaDesc}
              content={formData.fullDesc}
              slug={formData.slug}
              focusKeyword={formData.focusKeyword}
              onFocusKeywordChange={(keyword) => setFormData({ ...formData, focusKeyword: keyword })}
              baseUrl="https://melisa.ae/services"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
