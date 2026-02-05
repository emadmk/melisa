'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'
import SeoAnalyzer from '@/components/admin/SeoAnalyzer'
import { cn } from '@/lib/utils'

interface PostCategory {
  id: string
  nameFa: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<PostCategory[]>([])
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')

  const [form, setForm] = useState({
    titleFa: '',
    titleEn: '',
    titleAr: '',
    slug: '',
    excerpt: '',
    excerptAr: '',
    content: '',
    contentAr: '',
    image: '',
    status: 'DRAFT',
    author: '',
    postCategoryId: '',
    tags: '',
    metaTitle: '',
    metaTitleAr: '',
    metaDesc: '',
    metaDescAr: '',
    focusKeyword: '',
  })

  useEffect(() => {
    fetch('/api/admin/post-categories')
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
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image: form.image || null,
          postCategoryId: form.postCategoryId || null,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/posts')
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
          href="/admin/posts"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">New Post</h1>
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
                  English Title *
                </label>
                <input
                  type="text"
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
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
                  placeholder="Leave empty for auto-generation"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (English)
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (English)
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان (العربية)
                </label>
                <input
                  type="text"
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المقتطف (العربية)
                </label>
                <textarea
                  value={form.excerptAr}
                  onChange={(e) => setForm({ ...form, excerptAr: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المحتوى (العربية)
                </label>
                <textarea
                  value={form.contentAr}
                  onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>
            </>
          )}

          {/* Common fields shown in both tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={form.postCategoryId}
              onChange={(e) => setForm({ ...form, postCategoryId: e.target.value })}
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
              Tags
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Separate with commas"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              value={form.image || null}
              onChange={(url) => setForm({ ...form, image: url || '' })}
              folder="posts"
              label="Featured Image"
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
                      <span className={`ml-2 text-xs ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
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
                      Meta Description (English)
                      <span className={`ml-2 text-xs ${form.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
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
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الميتا (العربية)
                      <span className={`ml-2 text-xs ${form.metaTitleAr.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                        ({form.metaTitleAr.length}/60)
                      </span>
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
                      <span className={`ml-2 text-xs ${form.metaDescAr.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                        ({form.metaDescAr.length}/160)
                      </span>
                    </label>
                    <textarea
                      rows={2}
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

          {/* SEO Analyzer */}
          <div className="md:col-span-2">
            <SeoAnalyzer
              title={form.titleEn}
              metaTitle={form.metaTitle}
              metaDesc={form.metaDesc}
              content={form.content}
              slug={form.slug}
              focusKeyword={form.focusKeyword}
              onFocusKeywordChange={(keyword) => setForm({ ...form, focusKeyword: keyword })}
              baseUrl="https://melisa.ae/blog"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Link
            href="/admin/posts"
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
