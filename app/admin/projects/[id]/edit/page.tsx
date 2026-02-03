'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Save, X } from 'lucide-react'
import ImageUpload from '../../../components/ImageUpload'
import SeoAnalyzer from '@/components/admin/SeoAnalyzer'

export default function EditProjectPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [form, setForm] = useState({
    titleFa: '',
    titleEn: '',
    slug: '',
    description: '',
    images: [] as string[],
    client: '',
    location: '',
    year: '',
    status: 'DRAFT',
    featured: false,
    order: 0,
    metaTitle: '',
    metaDesc: '',
    focusKeyword: '',
  })

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const proj = data.data
          setForm({
            titleFa: proj.titleFa || '',
            titleEn: proj.titleEn || '',
            slug: proj.slug || '',
            description: proj.description || '',
            images: proj.images || [],
            client: proj.client || '',
            location: proj.location || '',
            year: proj.year || '',
            status: proj.status || 'DRAFT',
            featured: proj.featured || false,
            order: proj.order || 0,
            metaTitle: proj.metaTitle || '',
            metaDesc: proj.metaDesc || '',
            focusKeyword: proj.focusKeyword || '',
          })
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [id])

  const handleAddImage = (url: string | null) => {
    if (url) {
      setForm({ ...form, images: [...form.images, url] })
    }
  }

  const handleRemoveImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/projects')
      } else {
        alert(data.message || 'خطا در ذخیره')
      }
    } catch {
      alert('خطا در ذخیره')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
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
          href="/admin/projects"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">ویرایش پروژه</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان فارسی *
            </label>
            <input
              type="text"
              value={form.titleFa}
              onChange={(e) => setForm({ ...form, titleFa: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان انگلیسی
            </label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسلاگ
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کارفرما
            </label>
            <input
              type="text"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موقعیت
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سال
            </label>
            <input
              type="text"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="مثلا: 1402"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وضعیت
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="DRAFT">پیش‌نویس</option>
              <option value="PUBLISHED">منتشر شده</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ترتیب
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصاویر پروژه
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {form.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`تصویر ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <ImageUpload
              value={null}
              onChange={handleAddImage}
              folder="projects"
              label="افزودن تصویر"
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
              <span className="text-sm text-gray-700">پروژه ویژه</span>
            </label>
          </div>

          {/* SEO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان متا
              <span className={`mr-2 text-xs ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                ({form.metaTitle.length}/60)
              </span>
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
              توضیحات متا
              <span className={`mr-2 text-xs ${form.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                ({form.metaDesc.length}/160)
              </span>
            </label>
            <textarea
              rows={2}
              value={form.metaDesc}
              onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* SEO Analyzer */}
          <div className="md:col-span-2">
            <SeoAnalyzer
              title={form.titleFa}
              metaTitle={form.metaTitle}
              metaDesc={form.metaDesc}
              content={form.description}
              slug={form.slug}
              focusKeyword={form.focusKeyword}
              onFocusKeywordChange={(keyword) => setForm({ ...form, focusKeyword: keyword })}
              baseUrl="https://hatefertebat.ir/projects"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Link
            href="/admin/projects"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            انصراف
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
            ذخیره
          </button>
        </div>
      </form>
    </div>
  )
}
